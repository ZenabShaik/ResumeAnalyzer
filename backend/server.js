require("dotenv").config(); 
const multer = require("multer");


const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");

connectDB();

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], credentials: true }));
app.use(express.json());

app.use("/api/resumes", resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
