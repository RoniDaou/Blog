const cors = require("cors");
//Importing Express
const express = require("express");

//Importing dotenv that allows to load environment variables from a .env file into process.env
require("dotenv").config();

//Importing Mongoose to connect to the database on mongodb atlas
const mongoose = require("mongoose");

//Creating the Express App
const app = express();

app.use(
  cors({
    origin: ["https://blog-dar-1.onrender.com", "http://localhost:3000"],
    credentials: true,
  }),
);

const blogRoutes = require("./routes/blog");
const userRoutes = require("./routes/user");
const categoriesRoute = require("./routes/categories");

//Middleware build into Express to parse incoming JSON requests
app.use(express.json());

app.use("/blogs", blogRoutes);

app.use("/user", userRoutes);

app.use("/categories", categoriesRoute);

//Connect to the database
mongoose
  .connect(process.env.URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
