const express = require('express');
const projectRouter = require("./projectRouter.js");
const profileRouter = require("./profileRouter.js");
const assetRouter = require("./assetRouter.js");

const router = express.Router();
router.use("/projects", projectRouter);
router.use("/profile", profileRouter);
router.use("/assets", assetRouter);

module.exports = router;