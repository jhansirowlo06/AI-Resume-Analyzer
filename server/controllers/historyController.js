const Resume = require("../models/Resume");

const getHistory = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });

    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching history",
    });
  }
};

const deleteHistory = async (req, res) => {
  try {
    await Resume.deleteMany({});

    res.status(200).json({
      message: "History deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting history",
    });
  }
};

module.exports = {
  getHistory,
  deleteHistory,
};