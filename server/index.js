const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const db = require("./models");

const accounts = require("./routes/accounts");

//middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

function filenameOnly(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

fs.readdirSync(__dirname + "/routes")
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const route = require(path.join(__dirname + "/routes", file));
    app.use(`/${filenameOnly(file)}`, route);
  });

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
