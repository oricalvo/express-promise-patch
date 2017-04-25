const express = require("express");
const {patch: patchWithPromiseSupport} = require("express-promise-patch");

//const app = express();
const app = patchWithPromiseSupport(express());

app.get("*", function(req, res) {
    return Promise.resolve({
        id: 123,
        name: "Ori"
    }).then(obj => {
        throw new Error("Ooops");
    });
});

app.listen(3000, function() {
    console.log("Server is running");
});
