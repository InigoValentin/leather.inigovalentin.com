const express = require("express");
var path = require('path');
const router = express.Router();

// Read (GET) an asset
router.get("/images/projects/:projectId/:imagePath", async (req, res) => {
    var reqpath = req.url.toString().split('?')[0];
    var file = "./assets" + reqpath.replace(/\/$/, '');
    var scale = parseInt(req.query.w);
    // Serve a scaled image if width has been specified.
    if (parseInt(req.query.w) >= 0){
        var width = 100;
        for (var i = 100; i < 1000; i += 100){
            width = i;
            if (width >= scale) break;
        }
        file = file.replace("/assets/images/", "/assets/images_scaled/x" + width + "/");
    }
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    var options = {root: path.join(__dirname, "../../")}
    res.sendFile(file, options, function(err){
        if (err){
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('Not found');
        }
    });
});

router.get("/images/profile/:imagePath", async (req, res) => {
    var reqpath = req.url.toString().split('?')[0];
    var file = "./assets" + reqpath.replace(/\/$/, '');

    var scale = parseInt(req.query.w);
    // Serve a scaled image if width has been specified.
    if (parseInt(req.query.w) >= 0){
        var width = 100;
        for (var i = 100; i < 1000; i += 100){
            width = i;
            if (width >= scale) break;
        }
        file = file.replace("/assets/images/", "/assets/images_scaled/x" + width + "/");
    }
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    var options = {root: path.join(__dirname, "../../")}
    res.sendFile(file, options, function(err){
        if (err){
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('Not found');
        }
    });
});


module.exports = router;