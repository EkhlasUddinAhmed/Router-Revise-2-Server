require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./UserRouter/UserRouterHandler");

const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).send({ name: "Ekhlas" });
});

// DATABASE CONNENTION STARTING HERE
const uri =`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.13y3n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log("Connection URL is:",uri);
const PORT = process.env.PORT || 5000;

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(uri, config)
  .then(() => {
    console.log("DataBase Connection Successfull");
    app.listen(PORT, () => {
      console.log(
        `After Connecting DataBase ,Server is Running at PORT :${PORT}`
      );
    });
  })
  .catch((error) => console.log(error));


