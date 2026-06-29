const groq = require("../config/groq");

const improveResume = async (req, res) => {
    console.log("===== IMPROVE API =====");
console.log("Headers:", req.headers);
console.log("Body:", req.body);
  try {
    const { resume, jobDescription } = req.body;
        console.log("BODY RECEIVED:", req.body);

    if (!resume) {
        
      return res.status(400).json({
        success: false,
        message: "Resume text is required.",
      });
    }

    const prompt = `
You are a professional Resume Writer and ATS Expert.

Rewrite the following resume to maximize ATS score.

Job Description:
${jobDescription || "Software Engineer"}

Resume:
${resume}

Return ONLY valid JSON.

{
  "summary": "",
  "skills": [],
  "projects": [],
  "experience": [],
  "achievements": []
}

Rules:
- Improve grammar.
- Use professional language.
- Add ATS-friendly keywords.
- Keep all information truthful.
- Do not invent fake companies or experience.
- Return JSON only.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    let content = response.choices[0].message.content.trim();

    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    console.log("========== GROQ RESPONSE ==========");
console.log(content);
    const improvedResume = JSON.parse(content);
    

    return res.status(200).json({
      success: true,
      improvedResume,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  improveResume,
};