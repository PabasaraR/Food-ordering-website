const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const Port = 8080;
const DbUrl =
  "mongodb+srv://ppaba2177:ppaba2177@foodapp.y268nfz.mongodb.net/?retryWrites=true&w=majority&appName=foodApp";

app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const ProductRouter = require("./routes/ProductRouter");
const UserRouter = require("./routes/UserRouter");
app.use(ProductRouter);
app.use(UserRouter);

app.listen(Port, () => {
  console.log(`Server is Running ${Port}`);
});

mongoose
  .connect(DbUrl)

  .then(() => {
    console.log("DB is connected sucsessfully");
  })
  .catch((err) => {
    console.log("Error " + err);
  });
