const express = require("express");
var fs = require('fs');
var path = require('path');
const cors = require('cors');
const router = express.Router();

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript',
    mp4: 'video/mp4',
    ogv: 'video/ogg'
};

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
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.setHeader('Content-Type', type);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        s.pipe(res);
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

router.get("/images/profile/:imagePath", async (req, res) => {
    var reqpath = req.url.toString().split('?')[0];
    var file = "./assets" + reqpath.replace(/\/$/, '');
    console.log("GET PROFILE IMAGE: " + file);

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
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.setHeader('Content-Type', type);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        s.pipe(res);
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});


module.exports = router;