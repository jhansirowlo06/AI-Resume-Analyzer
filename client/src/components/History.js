import React, { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/history"
      );

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHistory = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete all history?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete("http://localhost:5000/api/history");

    fetchHistory();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="history-box">
      <h2>📂 Resume History</h2>

      <button onClick={deleteHistory}>
        🗑 Delete History
      </button>

      {history.length === 0 ? (
  <p>📂 No Resume History Found</p>
) : (
  history.slice(0, 5).map((item) => (
    <div className="history-card" key={item._id}>
      <h3>{item.filename.replace(/^\d+-/, "")}</h3>

      <p>
        {new Date(item.uploadedAt).toLocaleString()}
      </p>
    </div>
  ))
)}
    </div>
  );
}

export default History;