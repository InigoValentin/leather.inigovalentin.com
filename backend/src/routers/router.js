const express = require('express');
const projectRouter = require("./projectRouter.js");
const assetRouter = require("./assetRouter.js");

const router = express.Router();
router.use("/projects", projectRouter);
router.use("/assets", assetRouter);

module.exports = router;