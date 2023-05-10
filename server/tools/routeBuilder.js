const db = require("../models");
const fs = require("fs");
const path = require("path");

const getColumnNames = (attributes) => {
  return attributes.split(",").map((attr) => attr.split(":")[0]);
};

let args = process.argv.slice(2);

let table_name = args[1];
let table_name_singular = table_name;
let attributes = args[3];

const formattedColumnNames = getColumnNames(attributes).join(",\n      ");

let preamble = `const express = require("express");
const app = express();
const db = require("../models");

//middleware
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
`;

let list_route = `
module.exports = app.get("/", async (req, res) => {
  try {
    const list = await db["${table_name}"].findAll();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
`;

let create_route = `
module.exports = app.post("/", async (req, res) => {
  try {
    const {
      ${formattedColumnNames}
    } = req.body;
    const newEntry = await db["${table_name}"].create({
      ${formattedColumnNames}
    });
    console.log(newEntry);
    res.json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
`;

let read_route = `
module.exports = app.get("/:id", async (req, res) => {
  const objectId = req.params.id;
  try {
    const found = await db["${table_name}"].findByPk(objectId);
    if (!found) {
      return res
        .status(404)
        .json({ error: \`${table_name_singular} with id \${objectId} not found\` });
    }
    res.json(found);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
`;

let update_route = `
module.exports = app.put("/:id", async (req, res) => {
  const objectId = req.params.id;
  try {
    const found = await db["${table_name}"].findByPk(objectId);
    if (!found) {
      return res
        .status(404)
        .json({ error: \`${table_name_singular} with id \${objectId} not found\` });
    }
    const {
      ${formattedColumnNames}
    } = req.body;
    await found.update({
      ${formattedColumnNames}
    });
    res.json(found);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
`;

let delete_route = `
module.exports = app.delete("/:id", async (req, res) => {
  const objectId = req.params.id;
  try {
    console.log("Deleting ${table_name_singular} with id: ", objectId);
    const found = await db["${table_name}"].findByPk(objectId);
    if (!found) {
      return res
        .status(404)
        .json({ error: \`${table_name_singular} with id \${objectId} not found\` });
    }
    await found.destroy();
    console.log("${table_name_singular} deleted successfully", objectId);
    res.json({ message: \`${table_name_singular} with id \${objectId} deleted successfully\` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
`;

let contents =
  preamble +
  list_route +
  create_route +
  read_route +
  update_route +
  delete_route;

const filePath = path.join(__dirname, "..", "routes", `${table_name}.js`);
fs.writeFile(filePath, contents, (err) => {
  if (err) throw err;
  console.log(`File '${table_name}.js' has been saved to /routes!`);
});
