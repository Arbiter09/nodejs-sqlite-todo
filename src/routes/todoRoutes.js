import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all todos for a logged in user
router.get("/", (req, res) => {
  const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  const todos = getTodos.all(req.userId); // Assuming req.user.id is set after authentication
  res.json(todos);
});

// Create a new todo
router.post("/", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ message: "Task is reequired" });
  }
  const insertTodo = db.prepare(
    " INSERT INTO todos (user_id, task) VALUES (?, ?)"
  );
  const result = insertTodo.run(req.userId, task);
  res.status(201).json({ id: result.lastInsertRowid, task, completed: 0 });
});
// Update a todo
router.put("/:id", (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  const updatedTodo = db.prepare("UPDATE todos SET completed = ? WHERE id = ?");
  updatedTodo.run(completed, id);
  res.status(200).json({ message: "Todo updated successfully" });
});

// Delete a todo
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteTodo = db.prepare(
    "DELETE FROM todos WHERE id = ? AND user_id = ?"
  );
  deleteTodo.run(id, req.userId); // Ensure the user can only delete their own todos
  res.status(200).json({ message: "Todo deleted successfully" });
});

export default router;
