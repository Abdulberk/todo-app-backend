import { expect } from 'chai';
import { describe, it } from 'mocha';




const { getTodos, createTodo, updateTaskCompletedStatus, updateTodoTitle, addNewTask } = require('../controllers/todoControllers');

describe('Todo Controllers', () => {
  describe('getTodos', () => {
    it('should return todos for a specific user', async (done:any) => {
      const req = {
        user: {
          id: '647cc6bed7603ad95508b433',
 
        }
      };
      const res = {
        status: (statusCode:number) => {
          expect(statusCode).to.equal(200);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('todos');
          done();
        }
      };

      await getTodos(req, res);
    });

    it('should handle errors and return 500 status code', async (done:any) => {
      const req = {
        user: {
          id: '647cc6bed7603ad95508b433'
        }
      };
      const res = {
        status: (statusCode:number) => {
          expect(statusCode).to.equal(500);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('message');
          done();
        }
      };

      await getTodos(req, res);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async (done:any) => {
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
        status: (statusCode:number) => {
          expect(statusCode).to.equal(200);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('newTodo');
          done();
        }
      };

      await createTodo(req, res);
    });

    it('should handle errors and return 500 status code', async (done:any) => {
      const req = {
        user: {
          id: '647cc6bed7603ad95508b433'
        },
        body: {}
      };
      const res = {
        status: (statusCode:number) => {
          expect(statusCode).to.equal(500);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('message');
          done();
        }
      };

      await createTodo(req, res);
    });
  });

  describe('updateTaskCompletedStatus', () => {
    it('should update the completed status of a task', async (done:any) => {
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
        status: (statusCode:number) => {
          expect(statusCode).to.equal(200);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('updatedTask');
          done();
        }
      };

      await updateTaskCompletedStatus(req, res);
    });

    it('should handle errors and return 500 status code', async (done:any) => {
      const req = {
        user: {
          id: '647cc6bed7603ad95508b433'
        },
        params: {},
        body: {}
      };
      const res = {
        status: (statusCode:number) => {
          expect(statusCode).to.equal(500);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('message');
          done();
        }
      };

      await updateTaskCompletedStatus(req, res);
    });
  });

  describe('updateTodoTitle', () => {
    it('should update the title of a todo', async (done:any) => {
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
        status: (statusCode:number) => {
          expect(statusCode).to.equal(200);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('updatedTodo');
          done();
        }
      };

      await updateTodoTitle(req, res);
    });

    it('should handle errors and return 500 status code', async (done:any) => {
      const req = {
        user: {
          id: '647cc6bed7603ad95508b433'
        },
        params: {},
        body: {}
      };
      const res = {
        status: (statusCode:number) => {
          expect(statusCode).to.equal(500);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('message');
          done();
        }
      };

      await updateTodoTitle(req, res);
    });
  });

  describe('addNewTask', () => {
    it('should add a new task to a todo', async (done:any) => {
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
        status: (statusCode:number) => {
          expect(statusCode).to.equal(200);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('updatedTodo');
          done();
        }
      };

      await addNewTask(req, res);
    });

    it('should handle errors and return 500 status code', async (done:any
      ) => {
      const req = {
        user: {
          id: '647cc6bed7603ad95508b433'
        },
        params: {},
        body: {}
      };
      const res = {
        status: (statusCode:number) => {
          expect(statusCode).to.equal(500);
          return res;
        },
        json: (data:any) => {
          expect(data).to.have.property('message');
          done();
        }
      };

      await addNewTask(req, res);
    });
  });
});
