const Resume = require("../models/Resume");
const { extractAndAnalyze } = require("../services/analysisService");

// ✅ UPLOAD — already working, just hardened
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const analysis = await extractAndAnalyze(req.file.buffer);

    const savedResume = await Resume.create({
      file_name: req.file.originalname,
      ...analysis,
    });

    return res.status(201).json(savedResume);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return res.status(500).json({ message: "Resume processing failed" });
  }
};

// ✅ FIXED: GET ALL RESUMES — THIS IS THE HISTORY BUG FIX
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploaded_at: -1 });

    // ✅ Always return an ARRAY (never undefined / null)
    return res.status(200).json(resumes || []);
  } catch (error) {
    console.error("GET ALL RESUMES ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch resume history",
      resumes: [], // ✅ frontend-safe fallback
    });
  }
};

// ✅ FIXED: GET RESUME BY ID — hardened
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json(resume);
  } catch (error) {
    console.error("GET RESUME BY ID ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch resume",
    });
  }
};
