const pdfParse = require("pdf-parse");
const axios = require("axios");

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

const BASE_URL = "https://generativelanguage.googleapis.com/v1";

console.log(
  "✅ Gemini Key Loaded (first 12 chars):",
  GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 12) : "NONE"
);

// ✅ 1. Auto-detect a valid Gemini model at runtime
async function getValidGeminiModel() {
  const res = await axios.get(`${BASE_URL}/models?key=${GEMINI_API_KEY}`);
  const models = res.data.models || [];

  const usableModel = models.find(m =>
    m.supportedGenerationMethods?.includes("generateContent")
  );

  if (!usableModel) {
    throw new Error("❌ No usable Gemini model found for generateContent");
  }

  console.log("✅ Using Gemini Model:", usableModel.name);
  return usableModel.name;
}

exports.extractAndAnalyze = async (fileBuffer) => {
  try {
    // ✅ 2. Extract text from PDF
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text || "";

    // ✅ 3. Auto-detect working model
    const modelName = await getValidGeminiModel();

    // ✅ 4. WORLD-CLASS RECRUITER-GRADE PROMPT
    const prompt = `
You are a senior technical recruiter, hiring manager, and career strategist with deep expertise across software engineering, data, AI, product, and business roles.

Your task is to analyze the following resume and return ONLY a single, valid, strictly parseable JSON object. 
Do NOT include any explanation, markdown, commentary, or formatting outside the JSON.
Do NOT wrap the output in backticks or code blocks.
Do NOT leave any field undefined.

Base all insights strictly on the resume content.
If a field is missing, return null or an empty array []

========================================
RESUME CONTENT START
${resumeText}
RESUME CONTENT END
========================================

You must extract structured data AND perform analytical evaluation like a real recruiter.

Return JSON with this EXACT structure:

{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",

  "summary": "A concise recruiter-style professional summary inferred from the resume",

  "work_experience": [
    {
      "role": "string",
      "company": "string",
      "duration": "string",
      "description": ["string"]
    }
  ],

  "education": [
    {
      "degree": "string",
      "institution": "string",
      "graduation_year": "string"
    }
  ],

  "technical_skills": ["string"],
  "soft_skills": ["string"],

  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],

  "certifications": ["string"],

  "resume_rating": "number from 1 to 10 (based on clarity, impact, technical depth, and market readiness)",

  "improvement_areas": "A focused, high-impact critique covering gaps in skills, storytelling, structure, or experience positioning",

  "upskill_suggestions": [
    "Highly relevant skill or technology the candidate should learn next based on current profile and market demand"
  ]
}

Scoring Guidelines:
- 1–3: Very weak, not job-ready
- 4–5: Beginner, limited employability
- 6–7: Intern/Junior level job-ready
- 8: Strong mid-level professional
- 9: Highly competitive senior candidate
- 10: Elite, top 1% market-ready profile

Your output must be:
- Deterministic
- Clean JSON
- No hallucinated data
- No commentary
- No backticks
- No markdown
`;

    // ✅ 5. Call Gemini with verified model
    const response = await axios.post(
      `${BASE_URL}/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    let output =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // ✅ 6. Remove markdown formatting if Gemini adds ```json fences
    output = output
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ✅ 7. Final safe parse
    return JSON.parse(output);

  } catch (err) {
    console.error(
      "❌ AI/PDF Processing Failed:",
      err.response?.data || err.message
    );
    throw new Error("Resume analysis failed");
  }
};
