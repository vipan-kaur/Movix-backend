const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(express.json());
const PORT = 4001;
const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error("MONGODB_URL is not set in .env");
  process.exit(1);
}
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch((err) => console.log("Error in connecting Database:", err));
app.use(cors());
const registerRoutes = require("./routes/routes");
app.use("/signup", registerRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
