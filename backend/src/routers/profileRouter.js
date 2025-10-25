const express = require("express");
const cors = require('cors');
const profileData = require("../data/profileData.js");
const router = express.Router();

/**
 * Read (GET) the user profile.
 * 
 * Acccpeted request parameters:
 * 
 *  - lang: Two letter language code, case insensitive. If the data exists in
 *          the requested language it will be served, otherwise the default
 *          language will be used.
 */
router.get("/", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    var images = true;
    if (req.query.images == "false") images = false;
    else if (parseInt(req.query.images) != NaN && parseInt(req.query.images) >= 0)
        images = parseInt(req.query.images);
    var texts = true;
    if (req.query.texts == "false") texts = false;
    else if (parseInt(req.query.texts) != NaN && parseInt(req.query.texts) >= 0)
        texts = parseInt(req.query.texts);
    else if(
      req.query.texts != null
      && (req.query.texts.toLowerCase() == "home" || req.query.texts.toLowerCase() == "profile")
    ) texts = req.query.texts.toLowerCase();
    var lang = process.env.DEFAULT_LANGUAGE;
    if (
      req.query.lang
      && process.env.AVAILABLE_LANGUAGES.split(" ").includes(req.query.lang.toLowerCase())
    ) lang = req.query.lang.toLowerCase();
    const data = await profileData.getProfile(lang, images, texts);
    res.json(data);
});

module.exports = router;