const empModel = require("../models/dbModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
  const { username, email, phoneNumber, password, confirmPassword } =req.body;
  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    
      res.status(400).send({ "status": "required", "message": "all  fields are required" });
  } else {
    const user = await empModel.findOne({ email: email });
    if (user) {
      res.send({"status":"already", "message": "User already exists." });
    } else {
      if (password === confirmPassword) {
        const genSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, genSalt);

        const newEmp = new empModel({
          username,
          email,
          phoneNumber,
          password: hashPassword,
        });
        const userSave = await newEmp.save();
        if (userSave) {
          const token = jwt.sign({ _id: userSave._id },"SecretKey")
          res.status(200).send({"status":"success", "message": "User Registered Successfully!",token });
        }
      }
      else{
        res.send({"status":"false","message":"password and confirmpassword do not match"})
      }
    }
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await empModel.findOne({ email: email });
  if (email === "" || password === "") {
    res.send({ "status": "required", "message": "All fields must be filled out" });
  } else if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const payload = {
        userId: user._id,
      };
      const token = jwt.sign({ userId: payload.userId }, "SecretKey");
      res.status(200).send({ "status": "success", "message": "Login successful", token: token,"user":user.username });
    } else {
      res.status(400).send({ "status": "fail", "message": "Invalid Password" });
    }
  } else {
    res.status(400).send({ "status": "unmatch", "message": "Email is incorrect" });
  }
};


async function changePassword(req, res) {
  let { email, oldPassword, newPassword, confirmNewPassword } = req.body;
  const user = await empModel.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  if (
    email === "" ||
    oldPassword === "" ||
    newPassword === "" ||
    confirmNewPassword === ""
  ) {
    return res
      .status(400)
      .json({ status: "required", message: "Please fill all fields" });
  }

  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ status: "mismatch", message: "New and confirm passwords do not match" });
  }

  const isOldPassCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPassCorrect) {
    return res.status(400).json({ status: "error", message: "Old password is incorrect" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await empModel.updateOne(
      { _id: user._id },
      { password: hashedPassword }
    );

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error occurred while changing password:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}


module.exports = { userRegistration, userLogin, changePassword };
