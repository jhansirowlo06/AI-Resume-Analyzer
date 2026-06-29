import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function UploadResume() {
  const [file, setFile] = useState(null);
  //const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [jobDescription, setJobDescription] = useState("");

  const [atsScore, setAtsScore] = useState("");
  const [improvedResume, setImprovedResume] = useState(null);
const [improving, setImproving] = useState(false);
  const [matchScore, setMatchScore] = useState("");

  const [summary, setSummary] = useState("");

  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [recommendedRoles, setRecommendedRoles] = useState([]);
  const [projects, setProjects] = useState([]);
const [experience, setExperience] = useState([]);
const [education, setEducation] = useState([]);
//const [certifications, setCertifications] = useState([]);
//const [softSkills, setSoftSkills] = useState([]);
//const [weaknesses, setWeaknesses] = useState([]);
  
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("pdf", file);
      formData.append("jobDescription", jobDescription);

      const response = await axios.post(
        "https://ai-resume-analyzer-fd3a.onrender.com/api/documents/upload",
        formData
      );
      const data = response.data;

      setAtsScore(data.atsScore || "");
      setMatchScore(data.matchPercentage || "");

      setSummary(data.summary || "");

      setTechnicalSkills(data.technicalSkills || []);

      setMissingSkills(data.missingSkills || []);

      setStrengths(data.strengths || []);

      setSuggestions(data.suggestions || []);

      setRecommendedRoles(data.recommendedRoles || []);
      setProjects(data.projects || []);
setExperience(data.experience || []);
setEducation(data.education || []);
setCertifications(data.certifications || []);
setSoftSkills(data.softSkills || []);
setWeaknesses(data.weaknesses || []);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      alert(
        error.response?.data?.message ||
          "Resume Analysis Failed."
      );
    }
  };
  const improveResume = async () => {
  try {
    setImproving(true);

    const resumeText = `
Summary:
${summary}

Technical Skills:
${technicalSkills.join(", ")}

Strengths:
${strengths.join(", ")}

Suggestions:
${suggestions.join(", ")}

Recommended Roles:
${recommendedRoles.join(", ")}
`;

    const response = await axios.post(
      "https://ai-resume-analyzer-fd3a.onrender.com/api/documents/improve",
      {
        resume: resumeText,
        jobDescription: jobDescription,
      }
    );
    console.log(response.data);
    setImprovedResume(response.data.improvedResume);

    setImproving(false);

  } catch (error) {
    console.error(error);

    alert("Failed to improve resume.");

    setImproving(false);
  }
};

  const downloadPDF = () => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Resume Analysis Report", 20, y);

    y += 15;

    doc.setFontSize(12);

    doc.text(`ATS Score : ${atsScore}/100`, 20, y);

    y += 10;

    doc.text(`Match Percentage : ${matchScore}%`, 20, y);

    y += 15;

    doc.text("Resume Summary", 20, y);

    y += 8;

    const summaryLines = doc.splitTextToSize(summary, 170);

    doc.text(summaryLines, 20, y);

    y += summaryLines.length * 7 + 10;

    const addSection = (title, items) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFont(undefined, "bold");
      doc.text(title, 20, y);

      y += 8;

      doc.setFont(undefined, "normal");

      items.forEach((item) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        doc.text("• " + item, 25, y);

        y += 7;
      });

      y += 8;
    };

    addSection("Technical Skills", technicalSkills);

    addSection("Missing Skills", missingSkills);

    addSection("Strengths", strengths);

    addSection("Suggestions", suggestions);

    addSection("Recommended Roles", recommendedRoles);

    doc.save("Resume_Analysis_Report.pdf");
  };
  return (
  <div className="container">

    <h1>🚀 AI Resume Analyzer</h1>

    <p className="subtitle">
      Analyze your resume using AI and improve your ATS Score.
    </p>

    <div className="hero-stats">

      <div className="hero-card">
        <h3>🤖 AI Powered</h3>
        <p>Groq AI Analysis</p>
      </div>

      <div className="hero-card">
        <h3>📄 ATS Checker</h3>
        <p>Resume Optimization</p>
      </div>

      <div className="hero-card">
        <h3>🎯 JD Match</h3>
        <p>Skill Comparison</p>
      </div>

    </div>

    <div className="upload-box">

      <label className="upload-label">
        📄 Choose Resume PDF

        <input
          type="file"
          accept=".pdf"
          hidden
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <br />

      {file && <p>✅ {file.name}</p>}

      <br />

      <textarea
        className="job-description"
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br />
      <br />

      <button
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {loading && <p>⏳ AI is analyzing your resume...</p>}

    </div>

    {atsScore && (

      <div className="score-container">

        <div className="score-card">

<h2>⭐ ATS Score</h2>

<div
style={{
width:"140px",
height:"140px",
margin:"20px auto"
}}
>

<CircularProgressbar
value={atsScore}
text={`${atsScore}%`}
styles={buildStyles({

textSize:"18px",

pathColor:
atsScore>=80
?"#88ff00"
:atsScore>=60
?"#f59e0b"
:"#ef4444",

textColor:"#222",

trailColor:"#e5e7eb"

})}
/>

</div>

<p>

{atsScore>=80
?"Excellent Resume"

:atsScore>=60
?"Good Resume"

:"Needs Improvement"}

</p>

</div>

        <div className="score-card">

  <h2>🎯 Job Match</h2>

  <div
    style={{
      width: "140px",
      height: "140px",
      margin: "20px auto",
    }}
  >
    <CircularProgressbar
      value={matchScore}
      text={`${matchScore}%`}
      styles={buildStyles({
        textSize: "18px",

        pathColor:
          matchScore >= 80
            ? "#3b82f6"
            : matchScore >= 60
            ? "#f59e0b"
            : "#ef4444",

        textColor: "#222",

        trailColor: "#e5e7eb",
      })}
    />
  </div>

  <h3>
    {matchScore >= 80
      ? "Excellent Match"
      : matchScore >= 60
      ? "Good Match"
      : "Low Match"}
  </h3>

</div>

      </div>

    )}

    {atsScore && (

      <button onClick={downloadPDF}>
        📥 Download Report
      </button>
 )}
 {summary && (
  <button
    onClick={improveResume}
    disabled={improving}
    className="improve-btn"
  >
    {improving ? "⏳ Improving Resume..." : "✨ Improve Resume"}
  </button>
)}

    {summary && (

      <div className="analysis-box">

        <h2>📋 Resume Summary</h2>

        <p>{summary}</p>

        <hr />

        <h2>💻 Technical Skills</h2>

<div className="skills-container">
  {technicalSkills.map((skill, index) => (
    <span className="skill-chip" key={index}>
      {skill}
    </span>
  ))}
</div>

        <hr />

        <h2>❌ Missing Skills</h2>

<div className="missing-container">
  {missingSkills.map((skill, index) => (
    <span className="missing-chip" key={index}>
      {skill}
    </span>
  ))}
</div>

        <hr />
        <hr />

<h2>📁 Projects</h2>

<div className="recommendation-grid">

  {projects.length > 0 ? (

    projects.map((project, index) => (

      <div
        className="recommendation-card project-card"
        key={index}
      >
        <p>{project}</p>
      </div>

    ))

  ) : (

    <p>No Projects Found.</p>

  )}

</div>
<hr />

<h2>💼 Experience</h2>

<div className="recommendation-grid">

  {experience.length > 0 ? (

    experience.map((exp, index) => (

      <div
        className="recommendation-card experience-card"
        key={index}
      >
        <p>{exp}</p>
      </div>

    ))

  ) : (

    <p>No Experience Found.</p>

  )}

</div>
<hr />

<h2>🎓 Education</h2>

<div className="recommendation-grid">

  {education.length > 0 ? (

    education.map((edu, index) => (

      <div
        className="recommendation-card education-card"
        key={index}
      >
        <p>{edu}</p>
      </div>

    ))

  ) : (

    <p>No Education Found.</p>

  )}

</div>
        <h2>💪 Strengths</h2>

<div className="recommendation-grid">
  {strengths.map((item, index) => (
    <div className="recommendation-card strength-card" key={index}>
  <p>{item}</p>
</div>
  ))}
</div>

        <hr />

        <h2>🚀 Suggestions</h2>

<div className="recommendation-grid">
  {suggestions.map((item, index) => (
    <div className="recommendation-card suggestion-card" key={index}>
      <p>{item}</p>
    </div>
  ))}
</div>

        <hr />

       <h2>💼 Recommended Roles</h2>

<div className="recommendation-grid">
  {recommendedRoles.map((role, index) => (
    <div className="recommendation-card role-card" key={index}>
      <p>{role}</p>
    </div>
  ))}
</div>
<hr />

{improvedResume && (

  <div className="improved-resume-box">

    <h2>✨ AI Improved Resume</h2>

    <h3>📋 Professional Summary</h3>
    <p>{improvedResume.summary}</p>

    <hr />

    <h3>💻 Skills</h3>

    <div className="skills-container">
      {improvedResume.skills.map((skill, index) => (
        <span className="skill-chip" key={index}>
          {skill}
        </span>
      ))}
    </div>

    <hr />

    <h3>📁 Projects</h3>

    <ul>
      {improvedResume.projects.map((project, index) => (
        <li key={index}>{project}</li>
      ))}
    </ul>

    <hr />

    <h3>💼 Experience</h3>

    <ul>
      {improvedResume.experience.map((exp, index) => (
        <li key={index}>{exp}</li>
      ))}
    </ul>

    <hr />

    <h3>🏆 Achievements</h3>

    <ul>
      {improvedResume.achievements.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

  </div>

)}

      </div>

    )}

  </div>
);

}

export default UploadResume;