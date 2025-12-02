const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  file_name: String,
  name: String,
  email: String,
  phone: String,
  linkedin_url: String,
  portfolio_url: String,
  summary: String,

  work_experience: Array,
  education: Array,
  technical_skills: Array,
  soft_skills: Array,
  projects: Array,
  certifications: Array,

  resume_rating: Number,
  improvement_areas: String,
  upskill_suggestions: Array,

  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", ResumeSchema);
