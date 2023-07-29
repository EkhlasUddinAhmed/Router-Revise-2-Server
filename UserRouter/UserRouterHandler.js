const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");
const appointmentSchema = require("../Schemas/appointmentSchema");
const appointmentModel = new mongoose.model("Appointment", appointmentSchema);

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  console.log("From verifyJWT Method:", req.headers.authorization);
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: "UnAuthorize Access" });
  }
  const token = authorization.split(" ")[1];
  console.log("Token Extracted is:", token);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "UnAuthorize Access" });
    }
    console.log("Decoded is:", decoded);
    req.decoded = decoded;
    next();
  });
};

userRouter.post("/", async (req, res) => {
  try {
    const appointSave = new appointmentModel(req.body);
    const newAppointed = await appointSave.save();
    console.log("New AppointMents is:", newAppointed);
    // res.status(200).send({"post":"Ok"});
    // console.log("Appointment Error:",e.message);
  } catch (e) {
    res.status(500).send({ error: e.message });
    console.log("Appointment Error:", e.message);
  }
});

userRouter.get("/all", verifyJWT, async (req, res) => {
  try {
    const email = req?.query?.email;
    console.log("From Get All Router:", req.decoded);
    if (req.decoded.email !== email) {
      return res.status(403).send("Forbidden  Access");
    }

    let query = {};
    if (email) {
      query = {
        pEmail: email,
      };
    }
    const allAppointMent = await appointmentModel.find(query);
    res.status(200).send(allAppointMent);
    //    console.log("All Appointment Are:",allAppointMent);
  } catch (e) {
    res.status(500).send({ error: e.message });
    console.log("Appointment Error:", e.message);
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const deletedAppointment = await appointmentModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      {
        useFindOneAndDelete: false,
      }
    );
    res.status(200).send(deletedAppointment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/jwt", async (req, res) => {
  try {
    const loggedUser = req.body;
    const token = jwt.sign(loggedUser, process.env.ACCESS_TOKEN, {
      expiresIn: "9h",
    });
    console.log("Access Token is:", token);
    res.status(200).send({ token });
  } catch (e) {
    console.log("Error in Access Token:", e.message);
    res.status(500).send({ error: e.message });
  }
});

module.exports = userRouter;
