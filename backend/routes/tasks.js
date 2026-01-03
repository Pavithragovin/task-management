const express = require("express");
const { Task } = require("../models");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    status: req.body.status,
    UserId: req.user.id,
  });
  res.json(task);
});

router.get("/", auth, async (req, res) => {
  const tasks = await Task.findAll({ where: { UserId: req.user.id } });
  res.json(tasks);
});

router.put("/:id", auth, async (req, res) => {
  await Task.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Task updated" });
});

router.delete("/:id", auth, async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ message: "Task deleted" });
});

module.exports = router;
