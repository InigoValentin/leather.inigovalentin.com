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
    var lang = process.env.DEFAULT_LANGUAGE;
    if (
      req.query.lang
      && process.env.AVAILABLE_LANGUAGES.split(" ").includes(req.query.lang.toLowerCase())
    ) lang = req.query.lang.toLowerCase();
    const data = await profileData.getProfile(lang);
    res.json(data);
});

module.exports = router;