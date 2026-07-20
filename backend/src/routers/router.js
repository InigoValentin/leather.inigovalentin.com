const express = require('express');
const cors = require('cors');
const projectRouter = require("./projectRouter.js");
const profileRouter = require("./profileRouter.js");
const sitemapData = require("../data/sitemapData.js");
const assetRouter = require("./assetRouter.js");

const router = express.Router();
router.use("/projects", projectRouter);
router.use("/profile", profileRouter);
router.use("/assets", assetRouter);

router.get("/", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    const p = require('../../package.json');
    let api = {
      api: {
        version: p.version,
        author: {
          name: p.author,
          url: p.authorURL,
        },
        source: p.sourceURL
      }
    };
    res.json(api);
});

router.get("/sitemap.xml", async (req, res) => {
    const data = await sitemapData.generateSitemap();
    res.set('Content-Type', 'application/xml');
    res.send(data);
});

module.exports = router;