"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Todo_1 = __importDefault(require("../models/Todo"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Task_1 = __importDefault(require("../models/Task"));
const asyncHandler = require("express-async-handler");
const getTodos = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ message: "Lütfen giriş yapınız !" });
        const todos = yield Todo_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "tasks",
                    foreignField: "_id",
                    as: "tasks",
                },
            },
            {
                $project: {
                    title: 1,
                    tasks: {
                        _id: 1,
                        text: 1,
                        completed: 1,
                        todo: 1,
                        createdAt: 1,
                    },
                },
            },
        ]);
        return res.status(200).json({ myTodos: todos });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: err.message || "Bilinmeyen bir hata oluştu !" });
    }
}));
const createTodo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        if (!userId)
            return res.status(401).json({ message: "Lütfen giriş yapınız ! " });
        const { title, tasks } = req.body;
        if (!tasks || tasks.length === 0) {
            return res
                .status(400)
                .json({ message: "En az bir tane görev eklemelisiniz!" });
        }
        if (!title)
            return res.status(400).json({ message: "Lütfen bir başlık giriniz !" });
        const checkUser = yield User_1.default.findById(userId);
        if (!checkUser)
            return res
                .status(404)
                .json({ message: "Böyle bir kullanıcı bulunamadı !" });
        const newTodo = new Todo_1.default({
            title,
            tasks: [],
            user: userId,
        });
        yield newTodo.save();
        if (tasks && tasks.length > 1) {
            for (let task of tasks) {
                const newTask = new Task_1.default({
                    text: task.text,
                    completed: task.completed,
                    todo: newTodo._id,
                });
                yield newTask.save();
                newTodo.tasks.push(newTask._id);
            }
        }
        else if (tasks && tasks.length === 1) {
            const newTask = new Task_1.default({
                text: tasks[0].text,
                completed: tasks[0].completed,
                todo: newTodo._id,
            });
            yield newTask.save();
            newTodo.tasks.push(newTask._id);
        }
        yield newTodo.save();
        return res.status(200).json({
            newTodo,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: err.message || "Bilinmeyen bir hata oluştu !" });
    }
}));
const updateTodoTitle = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
    if (!userId)
        return res.status(401).json({ message: 'Lütfen giriş yapınız !' });
    const { todoId } = req.params;
    const { title } = req.body;
    if (!title)
        return res.status(400).json({ message: 'Güncellenecek başlık bulunamadı !' });
    if (!todoId)
        return res.status(400).json({ message: 'Güncellenecek todo bulunamadı !' });
    const todo = yield Todo_1.default.findById(todoId);
    if (!todo)
        return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });
    if (todo.user.toString() !== userId)
        return res.status(401).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır !' });
    todo.title = title;
    yield todo.save();
    return res.status(200).json({ todo });
}));
const updateTaskCompletedStatus = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    if (!userId)
        return res.status(401).json({ message: 'Lütfen giriş yapınız !' });
    const { todoId, taskId } = req.params;
    const { completed } = req.body;
    if (!todoId)
        return res.status(400).json({ message: 'Lütfen todo id belirtiniz !' });
    if (!taskId)
        return res.status(400).json({ message: 'Lütfen task id belirtiniz !' });
    if (typeof completed !== 'boolean')
        return res.status(400).json({ message: 'Lütfen tamamlanma durumunu belirtiniz !' });
    const todo = yield Todo_1.default.aggregate([
        {
            $match: {
                user: new mongoose_1.default.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: 'tasks',
                localField: 'tasks',
                foreignField: '_id',
                as: 'tasks',
            },
        },
        {
            $project: {
                title: 1,
                tasks: {
                    _id: 1,
                    text: 1,
                    completed: 1,
                }
            }
        }
    ]);
    if (!todo)
        return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });
    const getMyTodo = todo.find((todo) => todo._id.toString() === todoId);
    if (!getMyTodo)
        return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });
    const completedTask = getMyTodo.tasks.find((task) => task._id.toString() === taskId);
    if (!completedTask)
        return res.status(404).json({ message: 'Task statüsü güncellenemedi !' });
    completedTask.completed = completed;
    const updatedTodoTask = yield Task_1.default.findOneAndUpdate({ _id: taskId }, { $set: { completed: completed } }, { new: true, select: { text: 1, completed: 1, _id: 1, todo: 1 } });
    return res.status(200).json({
        message: 'Task statüsü güncellendi !',
        updatedTodoTask
    });
}));
const addNewTask = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        const checkUser = yield User_1.default.findOne({ _id: userId });
        if (!checkUser)
            return res.status(404).json({ message: 'Böyle bir kullanıcı bulunamadı !' });
        const { todoId } = req.params;
        if (!todoId)
            return res.status(400).json({ message: 'Lütfen task eklemek istediğiniz todo için bir id belirtiniz !' });
        const { text } = req.body;
        if (!text || text.length === 0)
            return res.status(400).json({ message: 'Lütfen bir task giriniz !' });
        const newTask = new Task_1.default({
            todo: todoId,
            text,
            completed: false,
        });
        if (!newTask)
            return res.status(400).json({ message: 'Task eklenemedi !' });
        yield newTask.save();
        const updatedTodo = yield Todo_1.default.findOneAndUpdate({ _id: todoId }, { $push: { tasks: newTask._id } }, { new: true, select: { title: 1, tasks: 1, _id: 1 } });
        return res.status(200).json({ updatedTodo });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Bilinmeyen bir hata oluştu !' });
    }
}));
const deleteTask = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
        if (!userId)
            return res.status(401).json({ message: 'Lütfen giriş yapınız !' });
        const { todoId, taskId } = req.params;
        if (!todoId)
            return res.status(400).json({ message: 'Lütfen todo id belirtiniz !' });
        if (!taskId)
            return res.status(400).json({ message: 'Lütfen task id belirtiniz !' });
        const todo = yield Todo_1.default.findById(todoId);
        if (!todo)
            return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });
        if (todo.user.toString() !== userId)
            return res.status(401).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır !' });
        const task = yield Task_1.default.findById(taskId);
        if (!task)
            return res.status(404).json({ message: 'Böyle bir task bulunamadı !' });
        yield Task_1.default.deleteOne({ _id: taskId });
        const updatedTasks = todo.tasks.filter((taskId) => taskId !== task._id.toString());
        todo.tasks = updatedTasks;
        yield todo.save();
        return res.status(200).json({ message: 'Task silindi!' });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || 'Bilinmeyen bir hata oluştu !' });
    }
}));
const deleteTodo = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.id;
        if (!userId)
            return res.status(401).json({ message: 'Lütfen giriş yapınız !' });
        const { todoId } = req.params;
        if (!todoId)
            return res.status(400).json({ message: 'Lütfen todo id belirtiniz !' });
        const todo = yield Todo_1.default.findOne({ _id: todoId });
        if (!todo)
            return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });
        if (todo.user.toString() !== userId)
            return res.status(401).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır !' });
        yield Todo_1.default.deleteOne({ _id: todoId });
        return res.status(200).json({ message: 'Todo silindi!' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Bilinmeyen bir hata oluştu !' });
    }
}));
module.exports = { getTodos, createTodo, updateTaskCompletedStatus, updateTodoTitle, addNewTask, deleteTask, deleteTodo };
