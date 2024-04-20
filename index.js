const express = require("express");
const { connectToMongoDB } = require("./connect");
const {restrictToLoggedInUserOnly,checkAuth} = require('./middleware/auth')
const path = require("path");
const app = express();
const PORT = 8001;
const cookieParser = require("cookie-parser");



const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.use(express.json()); // to support json data
app.use(express.urlencoded({ extended: false })); // to support form data
app.use(cookieParser());  // to use cookies

// view engine setup

app.set("view engine", `ejs`);
app.set("views", path.resolve("./views"));

//server side rendering
app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  }); // server side rendering
});

// inline middleware when req on /url then this runs
app.use("/url", restrictToLoggedInUserOnly ,urlRoute); // this route only can be used by
app.use("/user", userRoute)
app.use("/", checkAuth ,staticRoute); // only check if user is authenticated or not



app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toUTCString(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
