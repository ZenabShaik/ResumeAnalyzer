const Resume = require("../models/Resume");
const { extractAndAnalyze } = require("../services/analysisService");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const analysis = await extractAndAnalyze(req.file.buffer);

    const savedResume = await Resume.create({
      file_name: req.file.originalname,
      ...analysis
    });

    res.status(201).json(savedResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume processing failed" });
  }
};

exports.getAllResumes = async (req, res) => {
  const resumes = await Resume.find().sort({ uploaded_at: -1 });
  res.json(resumes);
};

exports.getResumeById = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
};
