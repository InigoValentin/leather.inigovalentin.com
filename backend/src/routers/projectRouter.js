const express = require("express");
const cors = require('cors');
const projectData = require("../data/projectData.js");
const router = express.Router();

// Read (GET) all projects
router.get("/", cors({origin: '*', methods: 'GET'}), async (req, res) => {
    const data = await projectData.getProjects();
    res.json(data);
});

// Read (GET) a specific project by ID or permalink
router.get("/:id", cors({origin: '*', methods: 'GET'}), async (req, res) => {
  const data = await projectData.getProject(req.params.id);
  if (!data) res.status(404).json({ error: "Project not found" });
  else res.json(data);
});

// Read (GET) a specific project images by ID or permalink
router.get("/:id/images", cors({origin: '*', methods: 'GET'}), async (req, res) => {
  const data = await projectData.getProjectImages(req.params.id);
  if (!data) res.status(404).json({ error: "Project not found" });
  else res.json(data);
});

// Read (GET) a specific project images by ID or permalink
router.get("/:projectId/images/:imageId", cors({origin: '*', methods: 'GET'}), async (req, res) => {
  const data = await projectData.getProjectImage(req.params.projectId, req.params.imageId);
  if (!data) res.status(404).json({ error: "Image not found" });
  else res.json(data);
});

module.exports = router;