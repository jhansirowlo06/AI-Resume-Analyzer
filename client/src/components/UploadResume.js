import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState("");
  const [matchScore, setMatchScore] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
formData.append("pdf", file);
formData.append("jobDescription", jobDescription);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/documents/upload",
        formData
      );

      setAnalysis(response.data.analysis);

      const scoreMatch = response.data.analysis.match(
        /ATS Score:[\s\S]*?([0-9]+%|[0-9.]+\/[0-9]+)/
      );

      if (scoreMatch) {
        setAtsScore(scoreMatch[1]);
        const matchPercentage = response.data.analysis.match(
  /Match Percentage:[\s\S]*?([0-9]+%)/
);

if (matchPercentage) {
  setMatchScore(matchPercentage[1]);
}
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Upload Failed");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("AI Resume Analysis Report", 20, 20);

    doc.setFontSize(11);

    const lines = doc.splitTextToSize(analysis, 170);

    doc.text(lines, 20, 40);

    doc.save("Resume_Analysis_Report.pdf");
  };

  return (
    <div className="container">
      <h1>🚀 AI Resume Analyzer</h1>
      <p className="subtitle">
  Analyze your resume using Google Gemini AI and improve your ATS score.
</p>
<div className="hero-stats">

  <div className="hero-card">
    <h3>🤖 AI Powered</h3>
    <p>Google Gemini Analysis</p>
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
    onChange={(e) => setFile(e.target.files[0])}
    hidden
  />
</label>

<br />

{file && (
  <p>✅ {file.name}</p>
)}
        <br /><br />

<textarea
  className="job-description"
  placeholder="📋 Paste the Job Description here..."
  value={jobDescription}
  onChange={(e) => setJobDescription(e.target.value)}
></textarea>

        <br />
        <br />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {loading && <p>⏳ Analyzing Resume...</p>}
      </div>

      {analysis && (
  <div className="score-container">

    <div className="score-card">
      <h2>⭐ ATS Score</h2>
      <h1>{atsScore}</h1>
    </div>

    {matchScore && (
      <div className="score-card">
        <h2>🎯 Match Percentage</h2>
        <h1>{matchScore}</h1>
      </div>
    )}

  </div>
)}

      {analysis && (
        <button onClick={downloadPDF}>
          📥 Download Report
        </button>
      )}

      {analysis && (
        <div className="analysis-box">
          <h2>📊 Analysis Result</h2>

          {analysis.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadResume;