const pdfParse = require("pdf-parse");
const fs = require("fs");
const Resume = require("../models/Resume");
const model = require("../config/gemini");

const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF file.",
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    // Save resume to MongoDB
    const newResume = new Resume({
      filename: req.file.filename,
      content: pdfData.text,
    });

    await newResume.save();

    const jobDescription =
      req.body.jobDescription || "Software Engineer";

    const prompt = `
You are an ATS Resume Expert.

Analyze the following resume against the given Job Description.

Job Description:
${jobDescription}

Resume:
${pdfData.text.substring(0, 2000)}

Return ONLY plain text.

Sections:

1. Resume Summary
2. Technical Skills
3. Strengths
4. Missing Skills
5. Recommended Roles
6. ATS Score (/100)
7. Match Percentage
8. Resume Improvement Tips
`;

    let result;

    // Retry Gemini API (handles temporary 503 errors)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await model.generateContent(prompt);
        break;
      } catch (err) {
        console.log(`Gemini Retry ${attempt}`);

        if (attempt === 3) {
          throw err;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
      }
    }

    const analysis = result.response.text();

    // Delete uploaded PDF after processing
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully.",
      analysis,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    // Delete uploaded file even if analysis fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message:
        "Gemini AI is temporarily busy. Please try again in a few seconds.",
    });
  }
};

module.exports = {
  uploadPDF,
};