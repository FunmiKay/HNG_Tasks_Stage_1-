require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectDB } = require("./config/database");
const stringRoutes = require("./routes/strings");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/strings", stringRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "String Analyzer Service API",
    version: "1.0.0",
    endpoints: {
      "POST /strings": "Create/analyze a string",
      "GET /strings/{string_value}": "Get specific string analysis",
      "GET /strings": "Get all strings with filtering",
      "GET /strings/filter-by-natural-language": "Natural language filtering",
      "DELETE /strings/{string_value}": "Delete a string",
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong!",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested endpoint does not exist",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`String Analyzer Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
