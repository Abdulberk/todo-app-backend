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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const { getTodos, createTodo, updateTaskCompletedStatus, updateTodoTitle, addNewTask } = require('../controllers/todoControllers');
(0, mocha_1.describe)('Todo Controllers', () => {
    (0, mocha_1.describe)('getTodos', () => {
        (0, mocha_1.it)('should return todos for a specific user', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433',
                }
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(200);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('todos');
                    done();
                }
            };
            yield getTodos(req, res);
        }));
        (0, mocha_1.it)('should handle errors and return 500 status code', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                }
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(500);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('message');
                    done();
                }
            };
            yield getTodos(req, res);
        }));
    });
    (0, mocha_1.describe)('createTodo', () => {
        (0, mocha_1.it)('should create a new todo', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                body: {
                    title: 'New Todo',
                    tasks: [
                        {
                            text: 'Task 1',
                            completed: false
                        },
                        {
                            text: 'Task 2',
                            completed: true
                        }
                    ]
                }
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(200);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('newTodo');
                    done();
                }
            };
            yield createTodo(req, res);
        }));
        (0, mocha_1.it)('should handle errors and return 500 status code', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                body: {}
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(500);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('message');
                    done();
                }
            };
            yield createTodo(req, res);
        }));
    });
    (0, mocha_1.describe)('updateTaskCompletedStatus', () => {
        (0, mocha_1.it)('should update the completed status of a task', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                params: {
                    todoId: '647bb3e671409d7a5ea98f9b',
                    taskId: '647bb3e671409d7a5ea98f9d'
                },
                body: {
                    completed: true
                }
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(200);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('updatedTask');
                    done();
                }
            };
            yield updateTaskCompletedStatus(req, res);
        }));
        (0, mocha_1.it)('should handle errors and return 500 status code', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                params: {},
                body: {}
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(500);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('message');
                    done();
                }
            };
            yield updateTaskCompletedStatus(req, res);
        }));
    });
    (0, mocha_1.describe)('updateTodoTitle', () => {
        (0, mocha_1.it)('should update the title of a todo', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                params: {
                    todoId: '647bb3e671409d7a5ea98f9b'
                },
                body: {
                    title: 'Updated Title'
                }
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(200);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('updatedTodo');
                    done();
                }
            };
            yield updateTodoTitle(req, res);
        }));
        (0, mocha_1.it)('should handle errors and return 500 status code', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                params: {},
                body: {}
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(500);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('message');
                    done();
                }
            };
            yield updateTodoTitle(req, res);
        }));
    });
    (0, mocha_1.describe)('addNewTask', () => {
        (0, mocha_1.it)('should add a new task to a todo', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                params: {
                    todoId: '647bb3e671409d7a5ea98f9b'
                },
                body: {
                    text: 'New Task',
                    completed: false
                }
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(200);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('updatedTodo');
                    done();
                }
            };
            yield addNewTask(req, res);
        }));
        (0, mocha_1.it)('should handle errors and return 500 status code', (done) => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                user: {
                    id: '647cc6bed7603ad95508b433'
                },
                params: {},
                body: {}
            };
            const res = {
                status: (statusCode) => {
                    (0, chai_1.expect)(statusCode).to.equal(500);
                    return res;
                },
                json: (data) => {
                    (0, chai_1.expect)(data).to.have.property('message');
                    done();
                }
            };
            yield addNewTask(req, res);
        }));
    });
});
