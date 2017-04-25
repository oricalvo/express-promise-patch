function isProduction() {
    return process.env.NODE_ENV == "production";
}

function writeContent(req, res, retVal) {
    if (typeof retVal == "object") {
        res.json(retVal);
    }
    else {
        res.write(retVal ? retVal.toString() : "");
        res.end();
    }
}

function writeError(req, res, err) {
    let statusCode = 500;
    let statusMessage = err.message;

    if (err instanceof HttpError) {
        statusCode = err.statusCode;
        statusMessage = err.statusMessage || err.message;
    }

    res.status(statusCode);
    res.statusMessage = statusMessage;

    if (!isProduction()) {
        res.write(err.stack.toString());
    }

    res.end();
}

function handler(req, res, originalHandler) {
    const _this = this;
    const _arguments = arguments;

    Promise.resolve()
        .then(function () {
            return originalHandler.apply(_this, _arguments);
        })
        .then(retVal => {
            writeContent(req, res, retVal);
        })
        .catch(function (err) {
            writeError(req, res, err);
        });
}

export function patch(app) {
    const methods = ["get", "post"];

    for (let method of methods) {
        const original = app[method];
        app[method] = function () {
            var originalHandler = arguments[1];

            if (typeof originalHandler == "function") {
                arguments[1] = function(req, res) {
                    handler(req, res, originalHandler);
                };
            }

            return original.apply(this, arguments);
        }
    }
}

export class HttpError extends Error {
    statusMessage: string;
    statusCode: number;

    constructor(message, statusCode, statusMessage) {
        super(message);

        this.statusMessage = statusMessage;
        this.statusCode = statusCode;
    }
}
