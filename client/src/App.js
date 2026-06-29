import { useState } from "react";
import "./App.css";

import UploadResume from "./components/UploadResume";
import History from "./components/History";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {

  const [activeTab, setActiveTab] = useState("analyzer");

  return (

    <div>

      <div className="top-navbar">

        <button
          className={activeTab === "analyzer" ? "active-tab" : ""}
          onClick={() => setActiveTab("analyzer")}
        >
          📄 Resume Analyzer
        </button>

        <button
          className={activeTab === "builder" ? "active-tab" : ""}
          onClick={() => setActiveTab("builder")}
        >
          📝 Resume Builder
        </button>

      </div>

      {activeTab === "analyzer" && (
        <>
          <UploadResume />
          <History />
        </>
      )}

      {activeTab === "builder" && (
        <ResumeBuilder />
      )}

    </div>

  );
}

export default App;