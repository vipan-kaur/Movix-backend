// const express = require("express");
// const registeredData = require("../models/Register");
// const routes = express.Router();
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();

// const OTP_generator = () => {
//   return Math.floor(Math.random() * 900000 + 100000);
// };

// const sendOTP = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.HOST,
//     port: process.env.PORT,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASS,
//     },
//   });

//   const info = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "OTP for verification",
//     text: `Your OTP is ${otp}`,
//   };

//   await transporter.sendMail(info, (err) => {
//     if (err) {
//       console.error("Error sending email:", err);
//     } else {
//       console.log("Email sent");
//     }
//   });
//   console.log("Message info:", info);
// };

// routes.post("/sendOtp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }
//   const userExist = await registeredData.findOne({ email: email });
//   if (userExist) {
//     return res.status(409).json({ error: "User already exists" });
//   }
//   const otp = OTP_generator();
//   await new registeredData({
//     email: email,
//     otp: otp,
//   }).save();
//   await sendOTP(email, otp);
//   res.status(200).json({ message: "OTP sent to your email" });
// });

// routes.post("/checkUser", async (req, res) => {
//   const { otp } = req.body;
//   const findUser = await registeredData.findOne({ otp: parseInt(otp) });
//   if (!findUser) {
//     return res.status(400).json({ error: "Wrong OTP" });
//   }
//   res.status(200).json({ message: "Email verified successfully" });
// });

// routes.post("/register", async (req, res) => {
//   const { email, password, securityQuestion, securityQuestionAnswer } = req.body;

//   if (!email || !password || !securityQuestion || !securityQuestionAnswer) {
//     return res.status(400).json({ error: "All fields are required." });
//   }

//   try {
//     const existingUser = await registeredData.findOne({ email });

//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists with this email." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new registeredData({
//       email,
//       password: hashedPassword,
//       securityQuestion,
//       securityQuestionAnswer,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// });

// routes.get("/getUser/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const user = await registeredData.findById(id);
//     if (user) {
//       res.status(200).json({ user });
//     } else {
//       res.status(404).json({ error: "No User Found" });
//     }
//   } catch (error) {
//     console.error("Get user error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// routes.get("/all", async (req, res) => {
//   try {
//     const allData = await registeredData.find();
//     if (allData.length) {
//       res.status(200).json(allData);
//     } else {
//       res.status(404).json({ error: "Database is empty" });
//     }
//   } catch (error) {
//     console.error("Get all users error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// routes.delete("/deleteUser/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const deleteUser = await registeredData.findByIdAndDelete(id);
//     if (!deleteUser) {
//       return res.status(404).json({ error: "User does not exist" });
//     } else {
//       res.status(200).json({ message: "User removed" });
//     }
//   } catch (error) {
//     console.error("Delete user error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// routes.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await registeredData.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ error: "User does not exist" });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ error: "Password does not match" });
//     }

//     const token = jwt.sign({ userId: user._id }, "passwordkey", { expiresIn: "1m" });
//     user.token = token;
//     await user.save();

//     res.status(200).json({ message: "Login successful", token, user });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// routes.post("/changePass", async (req, res) => {
//   try {
//     const { email, password, securityQuestion, securityQuestionAnswer } = req.body;
//     const user = await registeredData.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json({ error: "User does not exist" });
//     }

//     if (
//       user.securityQuestion !== securityQuestion ||
//       user.securityQuestionAnswer.toLowerCase() !== securityQuestionAnswer.toLowerCase()
//     ) {
//       return res.status(400).json({ error: "Given details do not match" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: "Password changed successfully" });
//   } catch (error) {
//     console.error("Change password error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = routes;



const express = require("express");
const registeredData = require("../models/Register");
const Otp = require("../models/OtpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const routes = express.Router();

// Generate 6 digit OTP
const OTP_generator = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for verification",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent");
    }
  });
};

routes.post("/sendOtp", async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    email = email.trim().toLowerCase();  // normalize here!

    const userExist = await registeredData.findOne({ email });
    if (userExist)
      return res.status(409).json({ error: "User already exists" });

    const otp = OTP_generator();

    const result = await Otp.findOneAndUpdate(
      { email },
      { $set: { otp, createdAt: new Date() } },
      { upsert: true, new: true }
    );
    console.log("OTP record saved to DB:", result);

    console.log("Saved OTP:", otp);

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2) Check OTP & verify email
routes.post("/checkUser", async (req, res) => {
  try {
    let { email, otp } = req.body;
    console.log("email:", email, "otp:", otp);

    email = email.trim().toLowerCase();

    const record = await Otp.findOne({ email });
    console.log("OTP record:", record);

    if (!record) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (record.otp !== parseInt(otp)) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

    await Otp.deleteOne({ email });
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("checkUser error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 3) Register user (only if no user with email)
routes.post("/register", async (req, res) => {
  try {
    const { email, password, securityQuestion, securityQuestionAnswer } = req.body;

    if (!email || !password || !securityQuestion || !securityQuestionAnswer)
      return res.status(400).json({ error: "All fields are required." });

    const existingUser = await registeredData.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "User already exists with this email." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new registeredData({
      email,
      password: hashedPassword,
      securityQuestion,
      securityQuestionAnswer,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4) Login user
routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registeredData.findOne({ email });

    if (!user) return res.status(404).json({ error: "User does not exist" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Password does not match" });

    const token = jwt.sign({ userId: user._id }, "passwordkey", { expiresIn: "1h" }); // 1h token expiration

    user.token = token;
    await user.save();

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5) Change password with security question
routes.post("/changePass", async (req, res) => {
  try {
    const { email, password, securityQuestion, securityQuestionAnswer } = req.body;
    const user = await registeredData.findOne({ email });
    if (!user) return res.status(404).json({ error: "User does not exist" });

    if (
      user.securityQuestion !== securityQuestion ||
      user.securityQuestionAnswer.toLowerCase() !== securityQuestionAnswer.toLowerCase()
    ) {
      return res.status(400).json({ error: "Given details do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePass error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 6) Get user by ID
routes.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await registeredData.findById(id);
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: "No User Found" });
    }
  } catch (error) {
    console.error("getUser error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 7) Get all users
routes.get("/all", async (req, res) => {
  try {
    const allData = await registeredData.find();
    if (allData.length) {
      res.status(200).json(allData);
    } else {
      res.status(404).json({ error: "Database is empty" });
    }
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 8) Delete user by ID
routes.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleteUser = await registeredData.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(404).json({ error: "User does not exist" });
    } else {
      res.status(200).json({ message: "User removed" });
    }
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = routes;
