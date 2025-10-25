const express = require("express");
const cors = require('cors');
const projectData = require("../data/projectData.js");
const router = express.Router();

/**
 * Read (GET) all projects, sorted by priority.
 * 
 * Acccpeted request parameters:
 * 
 *  - lang: Two letter language code, case insensitive.. If the data exists in
 *          the requested language it will be served, otherwise the default
 *          language will be used.
 * 
 *  - images: True, false, or a positive integer. If true, projects will
 *            include all of their images, sorted by priority. If false, none
 *            will be included. If a number is provided, up to that many images
 *            will be provided. Default value is true.  
 */
router.get("/", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    var images = true;
    if (req.query.images == "false") images = false;
    else if (parseInt(req.query.images) != NaN && parseInt(req.query.images) >= 0)
        images = parseInt(req.query.images);
    var lang = process.env.DEFAULT_LANGUAGE;
    if (
      req.query.lang
      && process.env.AVAILABLE_LANGUAGES.split(" ").includes(req.query.lang.toLowerCase())
    ) lang = req.query.lang.toLowerCase();
    const data = await projectData.getProjects(lang, images);
    res.json(data);
});

// Read (GET) a specific project by ID or permalink
router.get("/:id", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    var images = true;
    if (req.query.images == "false") images = false;
    else if (parseInt(req.query.images) != NaN && parseInt(req.query.images) >= 0)
        images = parseInt(req.query.images);
    var lang = process.env.DEFAULT_LANGUAGE;
    if (
      req.query.lang
      && process.env.AVAILABLE_LANGUAGES.split(" ").includes(req.query.lang.toLowerCase())
    ) lang = req.query.lang.toLowerCase();
    const data = await projectData.getProject(req.params.id, lang, images);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!data || data == "[]") res.status(404).json({ error: "Project not found" });
    else res.json(data);
});

// Read (GET) a specific project images by ID or permalink
router.get("/:id/images", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    var lang = process.env.DEFAULT_LANGUAGE;
    if (
      req.query.lang
      && process.env.AVAILABLE_LANGUAGES.split(" ").includes(req.query.lang.toLowerCase())
    ) lang = req.query.lang.toLowerCase();
    var max = null;
    if (parseInt(req.query.max) != NaN && parseInt(req.query.max) >= 0)
        max = parseInt(req.query.max);
    const data = await projectData.getProjectImages(req.params.id, lang, max);
    if (!data) res.status(404).json({ error: "Project not found" });
    else res.json(data);
});

// Read (GET) a specific project images by ID or permalink
router.get("/:projectId/images/:imageId", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    var lang = process.env.DEFAULT_LANGUAGE;
    if (
      req.query.lang
      && process.env.AVAILABLE_LANGUAGES.split(" ").includes(req.query.lang.toLowerCase())
    ) lang = req.query.lang.toLowerCase();
    const data = await projectData.getProjectImage(req.params.projectId, req.params.imageId, lang);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!data) res.status(404).json({ error: "Image not found" });
    else{
        res.json(data);
    }
});

module.exports = router;