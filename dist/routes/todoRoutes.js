"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getTodos, createTodo, updateTaskCompletedStatus, updateTodoTitle, addNewTask, deleteTask, deleteTodo } = require('../controllers/todoControllers');
const verifyToken_1 = __importDefault(require("../auth/verifyToken"));
router.get('/get-todos', verifyToken_1.default, getTodos);
router.post('/add-todo', verifyToken_1.default, createTodo);
router.put('/update-task-status/todo/:todoId/task/:taskId', verifyToken_1.default, updateTaskCompletedStatus);
router.put('/update-todo-title/:todoId', verifyToken_1.default, updateTodoTitle);
router.put('/add-task/:todoId', verifyToken_1.default, addNewTask);
router.delete('/delete-task/todo/:todoId/task/:taskId', verifyToken_1.default, deleteTask);
router.delete('/delete-todo/:todoId', verifyToken_1.default, deleteTodo);
exports.default = router;
