import React, { useState } from "react";
import jsPDF from "jspdf";

function ResumeBuilder() {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [summary, setSummary] = useState("");

  const [degree, setDegree] = useState("");
const [college, setCollege] = useState("");
const [cgpa, setCgpa] = useState("");
const [startYear, setStartYear] = useState("");
const [endYear, setEndYear] = useState("");
const [company, setCompany] = useState("");
const [role, setRole] = useState("");
const [experienceDescription, setExperienceDescription] = useState("");
const [experienceStart, setExperienceStart] = useState("");
const [experienceEnd, setExperienceEnd] = useState("");
const [projectName, setProjectName] = useState("");
const [projectTech, setProjectTech] = useState("");
const [projectDescription, setProjectDescription] = useState("");
const [githubLink, setGithubLink] = useState("");
const [skills, setSkills] = useState("");
const [certifications, setCertifications] = useState("");
const generateResume = () => {

  const doc = new jsPDF();

  let y = 20;

  // Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(fullName || "Your Name", 20, y);

  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  doc.text(`Email: ${email}`, 20, y);
  y += 7;

  doc.text(`Phone: ${phone}`, 20, y);
  y += 7;

  doc.text(`LinkedIn: ${linkedin}`, 20, y);
  y += 7;

  doc.text(`GitHub: ${github}`, 20, y);

  y += 15;

  // Summary
  doc.setFont("helvetica", "bold");
  doc.text("Professional Summary", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  const summaryLines = doc.splitTextToSize(summary, 170);

  doc.text(summaryLines, 20, y);

  y += summaryLines.length * 7 + 10;

  // Education
  doc.setFont("helvetica", "bold");
  doc.text("Education", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(`Degree : ${degree}`, 20, y);
  y += 7;

  doc.text(`College : ${college}`, 20, y);
  y += 7;

  doc.text(`CGPA : ${cgpa}`, 20, y);
  y += 7;

  doc.text(`${startYear} - ${endYear}`, 20, y);

  y += 12;

  // Experience
  doc.setFont("helvetica", "bold");
  doc.text("Experience", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(`Company : ${company}`, 20, y);

  y += 7;

  doc.text(`Role : ${role}`, 20, y);

  y += 7;

  const exp = doc.splitTextToSize(experienceDescription, 170);

  doc.text(exp, 20, y);

  y += exp.length * 7 + 10;

  // Project
  doc.setFont("helvetica", "bold");
  doc.text("Project", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(projectName, 20, y);

  y += 7;

  doc.text(projectTech, 20, y);

  y += 7;

  const project = doc.splitTextToSize(projectDescription, 170);

  doc.text(project, 20, y);

  y += project.length * 7 + 10;

  // Skills
  doc.setFont("helvetica", "bold");
  doc.text("Skills", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  const skillLines = doc.splitTextToSize(skills, 170);

  doc.text(skillLines, 20, y);

  y += skillLines.length * 7 + 10;

  // Certifications
  doc.setFont("helvetica", "bold");
  doc.text("Certifications", 20, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  const certLines = doc.splitTextToSize(certifications, 170);

  doc.text(certLines, 20, y);

  doc.save(`${fullName || "Resume"}.pdf`);

};
  return (
<div className="builder-wrapper">

  <div className="builder-card">

    <h1>📝 Resume Builder</h1>

      <div className="builder-card">

        <h2>👤 Personal Details</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="LinkedIn URL"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />

        <input
          type="text"
          placeholder="GitHub URL"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />

        <h2>🎯 Professional Summary</h2>

        <textarea
          placeholder="Write your professional summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <h2>🎓 Education</h2>

        <input
          type="text"
          placeholder="Degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
        />

        <input
          type="text"
          placeholder="College Name"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />

        <input
          type="text"
          placeholder="CGPA / Percentage"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />

        <input
          type="text"
          placeholder="Start Year"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
        />

        <input
          type="text"
          placeholder="End Year"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
        />
        <hr />

<h2>💼 Experience</h2>

<input
  type="text"
  placeholder="Company Name"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
/>

<input
  type="text"
  placeholder="Job Role / Internship Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
/>

<textarea
  placeholder="Describe your work..."
  value={experienceDescription}
  onChange={(e) => setExperienceDescription(e.target.value)}
/>

<input
  type="text"
  placeholder="Start Year (Example: 2025)"
  value={experienceStart}
  onChange={(e) => setExperienceStart(e.target.value)}
/>

<input
  type="text"
  placeholder="End Year (Example: 2026 or Present)"
  value={experienceEnd}
  onChange={(e) => setExperienceEnd(e.target.value)}
/>
<hr />

<h2>📁 Projects</h2>

<input
  type="text"
  placeholder="Project Name"
  value={projectName}
  onChange={(e) => setProjectName(e.target.value)}
/>

<input
  type="text"
  placeholder="Technologies Used (Example: React, Node.js, MongoDB)"
  value={projectTech}
  onChange={(e) => setProjectTech(e.target.value)}
/>

<textarea
  placeholder="Project Description"
  value={projectDescription}
  onChange={(e) => setProjectDescription(e.target.value)}
/>

<input
  type="text"
  placeholder="GitHub Project Link"
  value={githubLink}
  onChange={(e) => setGithubLink(e.target.value)}
/>
<hr />

<h2>💻 Skills</h2>

<textarea
  placeholder="Enter your skills (Example: Java, Python, React, Node.js, MongoDB)"
  value={skills}
  onChange={(e) => setSkills(e.target.value)}
/>

<hr />

<h2>📜 Certifications</h2>

<textarea
  placeholder="Enter your certifications (One per line)"
  value={certifications}
  onChange={(e) => setCertifications(e.target.value)}
/>

<hr />
<button
  className="generate-btn"
  onClick={generateResume}
>
  📄 Generate Resume
</button>

</div>
</div>

<div className="resume-preview">

  <h1>{fullName || "Your Name"}</h1>

  <p>{email}</p>

  <p>{phone}</p>

  <p>{linkedin}</p>

  <p>{github}</p>

  <hr />

  <h2>Professional Summary</h2>

  <p>{summary}</p>

  <hr />

  <h2>Education</h2>

  <p>{degree}</p>
  <p>{college}</p>
  <p>{cgpa}</p>
  <p>
    {startYear} {startYear && endYear ? " - " : ""}
    {endYear}
  </p>

</div>

</div>    
  );
  
}


export default ResumeBuilder;