const express = require("express");
const app = express();
const db = require("../models");

//middleware
app.use(express.json());
app.use(express.json({ limit: "50mb" }));

module.exports = app.get("/", async (req, res) => {
  try {
    const list = await db["accounts"].findAll();
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app.post("/", async (req, res) => {
  try {
    const {
      category,
      name,
      account_number,
      description,
      debit,
      balance,
      created_by,
      read_at,
      deleted_at
    } = req.body;
    const newEntry = await db["accounts"].create({
      category,
      name,
      account_number,
      description,
      debit,
      balance,
      created_by,
      read_at,
      deleted_at
    });
    console.log(newEntry);
    res.json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app.get("/:id", async (req, res) => {
  const objectId = req.params.id;
  try {
    const found = await db["accounts"].findByPk(objectId);
    if (!found) {
      return res
        .status(404)
        .json({ error: `accounts with id ${objectId} not found` });
    }
    res.json(found);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app.put("/:id", async (req, res) => {
  const objectId = req.params.id;
  try {
    const found = await db["accounts"].findByPk(objectId);
    if (!found) {
      return res
        .status(404)
        .json({ error: `accounts with id ${objectId} not found` });
    }
    const {
      category,
      name,
      account_number,
      description,
      debit,
      balance,
      created_by,
      read_at,
      deleted_at
    } = req.body;
    await found.update({
      category,
      name,
      account_number,
      description,
      debit,
      balance,
      created_by,
      read_at,
      deleted_at
    });
    res.json(found);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app.delete("/:id", async (req, res) => {
  const objectId = req.params.id;
  try {
    console.log("Deleting accounts with id: ", objectId);
    const found = await db["accounts"].findByPk(objectId);
    if (!found) {
      return res
        .status(404)
        .json({ error: `accounts with id ${objectId} not found` });
    }
    await found.destroy();
    console.log("accounts deleted successfully", objectId);
    res.json({ message: `accounts with id ${objectId} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
