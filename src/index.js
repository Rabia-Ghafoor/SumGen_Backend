const express = require("express");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Import routes
const commentsRoutes = require("./routes/comments");
const transcriptsRoutes = require("./routes/transcripts");

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

app.use("/comments", commentsRoutes);
app.use("/transcripts", transcriptsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports.handler = serverless(app);
