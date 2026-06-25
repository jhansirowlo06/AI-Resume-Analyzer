const pdfParse = require("pdf-parse");
const fs = require("fs");
const Resume = require("../models/Resume");
const model = require("../config/gemini");

const uploadPDF = async (req, res) => {
  try {
    console.log("REQ FILE =", req.file);

    const dataBuffer = fs.readFileSync(req.file.path);

    console.log("PDF reading started...");

    const pdfData = await pdfParse(dataBuffer);

    const newResume = new Resume({
      filename: req.file.filename,
      content: pdfData.text,
    });

    await newResume.save();
    const jobDescription = req.body.jobDescription;

    const prompt = `
Analyze this resume against the following job description.

Job Description:
${jobDescription || "General Software Engineer Role"}

Resume:
${pdfData.text.substring(0, 3000)}

Provide:

1. Resume Summary
2. Technical Skills
3. Strengths
4. Missing Skills
5. Recommended Roles
6. ATS Score
7. Match Percentage with Job Description
8. Suggestions to improve the resume

Always provide a match percentage even if no job description is provided.
`;

    const result = await model.generateContent([prompt]);
    const analysis = result.response.text();

    res.status(200).json({
      message: "PDF uploaded and analyzed successfully",
      analysis,
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error(error.message);

    res.status(500).json({
      message: "Error extracting PDF text",
    });
  }
};

module.exports = { uploadPDF };