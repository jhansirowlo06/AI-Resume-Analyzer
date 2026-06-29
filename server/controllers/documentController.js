const pdfParse = require("pdf-parse");
const fs = require("fs");
const Resume = require("../models/Resume");
const groq = require("../config/groq");

const uploadPDF = async (req, res) => {
  try {
    console.log("===== UPLOAD REQUEST RECEIVED =====");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file.",
      });
    }

    // Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    // Save Resume
    await Resume.create({
      filename: req.file.filename,
      content: pdfData.text,
    });

    const jobDescription =
      req.body.jobDescription?.trim() || "Software Engineer";

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the resume against the given Job Description.

Job Description:
${jobDescription}

Resume:
${pdfData.text.substring(0, 3500)}

Return ONLY valid JSON.

{
  "atsScore": 85,
  "matchPercentage": 90,
  "summary": "Maximum 4 lines",

  "technicalSkills": [
    "Skill 1",
    "Skill 2"
  ],

  "missingSkills": [
    "Skill 1",
    "Skill 2"
  ],

  "projects": [
    "Project 1",
    "Project 2"
  ],

  "experience": [
    "Experience 1",
    "Experience 2"
  ],

  "education": [
    "Degree",
    "College"
  ],

  "certifications": [
    "Certification 1",
    "Certification 2"
  ],

  "softSkills": [
    "Communication",
    "Leadership"
  ],

  "strengths": [
    "Strength 1",
    "Strength 2"
  ],

  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],

  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ],

  "recommendedRoles": [
    "Role 1",
    "Role 2"
  ]
}

Rules:
1. Return ONLY valid JSON.
2. Do NOT return markdown.
3. Do NOT wrap the response in code fences.
4. ATS Score must be an integer between 0 and 100.
5. Match Percentage must be an integer between 0 and 100.
6. Resume Summary should be maximum 4 lines.
7. Extract the candidate's Technical Skills.
8. Mention Missing Skills based on the Job Description.
9. Extract important Projects and explain each project in one short sentence.
10. Extract Work Experience or Internship details.
11. Education:

Extract ALL educational qualifications from the resume.

Include every education level separately.

Examples:

- SSC / 10th
- Intermediate / 12th
- Diploma
- Bachelor's Degree
- Master's Degree

For EACH education entry include:

- Qualification
- College/School Name
- University/Board (if available)
- CGPA or Percentage (if available)
- Start Year - End Year

Return as separate array items.

Example:

"education":[
"SSC - ZP High School - CGPA 10 - 2018",
"Intermediate MPC - Sri Chaitanya Junior College - 96% - 2018-2020",
"B.Tech CSE - VIT University - CGPA 8.7 - 2022-2026"
]
12. Certifications:

Extract ALL certifications mentioned in the resume.

Include:

- NPTEL Certifications
- Coursera
- Udemy
- AWS
- Oracle
- Cisco
- Microsoft
- Google
- Infosys Springboard
- Internships Certificates
- Workshop Certificates
- Hackathon Certificates
- Any Online Certification

For each certification include:

- Certification Name
- Platform/Organization
- Completion Year (if available)

Return each certification as a separate array item.

Example:

"certifications":[
"AWS Cloud Practitioner - Amazon - 2025",
"Oracle Java Foundation - Oracle - 2024",
"NPTEL Python Programming - IIT Madras - 2025"
]
13. Extract Soft Skills.
14. Mention Resume Strengths.
15. Mention Resume Weaknesses.
16. Give ATS improvement Suggestions.
17. Recommend the best Job Roles.
18. If any section is not available, return an empty array [] instead of making up information.
19. Do not invent projects, experience, certifications, companies, or achievements that are not present in the resume.
20. Ensure the JSON is valid and can be parsed directly.
21. Never combine multiple education records into one item.
22. Never combine multiple certifications into one item.
`;

    console.log("Calling OpenRouter...");

    const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.3,
  max_tokens: 800,
});

    let aiResponse = response.choices[0].message.content.trim();

    // Remove markdown if returned
    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let analysis;

    try {
      analysis = JSON.parse(aiResponse);
    } catch (err) {
      console.error("JSON Parse Error:", aiResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON.",
      });
    }

    // Delete uploaded PDF
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.log("AI Response:", analysis);

    return res.status(200).json({
  success: true,

  atsScore: analysis.atsScore,

  matchPercentage: analysis.matchPercentage,

  summary: analysis.summary,

  technicalSkills: analysis.technicalSkills,

  missingSkills: analysis.missingSkills,

  projects: analysis.projects || [],

  experience: analysis.experience || [],

  education: analysis.education || [],

  certifications: analysis.certifications || [],

  softSkills: analysis.softSkills || [],

  weaknesses: analysis.weaknesses || [],

  strengths: analysis.strengths,

  suggestions: analysis.suggestions,

  recommendedRoles: analysis.recommendedRoles,
});
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadPDF,
};