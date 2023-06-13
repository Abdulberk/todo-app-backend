import express from "express";
const router = express.Router();
const {getTodos, createTodo, updateTaskCompletedStatus, updateTodoTitle, addNewTask, deleteTask,deleteTodo} = require('../controllers/todoControllers');
import verifyToken from '../auth/verifyToken';



router.get('/get-todos', verifyToken, getTodos)
router.post('/add-todo', verifyToken, createTodo)
router.put('/update-task-status/todo/:todoId/task/:taskId', verifyToken, updateTaskCompletedStatus)
router.put('/update-todo-title/:todoId', verifyToken, updateTodoTitle)
router.put('/add-task/:todoId', verifyToken, addNewTask)
router.delete('/delete-task/todo/:todoId/task/:taskId', verifyToken, deleteTask)
router.delete('/delete-todo/:todoId', verifyToken, deleteTodo)


export default router;

