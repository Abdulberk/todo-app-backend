import TodoModel, { ITodo } from "../models/Todo";
import { Request, Response, RequestHandler } from "express";
import mongoose from "mongoose";
import UserModel from "../models/User";
import TaskModel from "../models/Task";
const asyncHandler = require("express-async-handler");
import { ITask } from "../models/Task";

export interface IReq extends Request {
  
  body: {
    completed?: boolean;
    title?: string;
    text?: string;
    tasks?: {
      text: string;
      completed: boolean;
      createdAt: string;

    }[];
  },
  params: {
    todoId: string;
    taskId: string;
  }
  user?: {
    id: string | undefined;
  }

}


interface IRes extends Response {
  message?: string;
  status: (statusCode: number) => {
    json: (data: any) => IRes;
  };

}





const getTodos: RequestHandler = asyncHandler(
  async (req: IReq, res: IRes) => {
    try {
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ message: "Lütfen giriş yapınız !" });



      const todos = await TodoModel.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
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

      return res.status(200).json({ myTodos:todos });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: err.message || "Bilinmeyen bir hata oluştu !" });
    }
  }
);

const createTodo: RequestHandler = asyncHandler(
  async (req: IReq, res: IRes) => {
    try {
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ message: "Lütfen giriş yapınız ! " });
      const { title, tasks } = req.body;

      if (!tasks || tasks.length === 0) {
        return res
          .status(400)
          .json({ message: "En az bir tane görev eklemelisiniz!" });
      }

      if (!title)
        return res.status(400).json({ message: "Lütfen bir başlık giriniz !" });

      

      const checkUser = await UserModel.findById(userId);
      if (!checkUser)
        return res
          .status(404)
          .json({ message: "Böyle bir kullanıcı bulunamadı !" });

      const newTodo = new TodoModel({
        title,
        tasks: [],
        user: userId,
      });

      await newTodo.save();

      if (tasks && tasks.length > 1) {
        for (let task of tasks) {
          const newTask = new TaskModel({
            text: task.text,
            completed: task.completed,
            todo: newTodo._id,
          });

          await newTask.save();

          newTodo.tasks.push(newTask._id);
        }
      } else if (tasks && tasks.length === 1) {
        const newTask = new TaskModel({
          text: tasks[0].text,
          completed: tasks[0].completed,
          todo: newTodo._id,
        });

        await newTask.save();

        newTodo.tasks.push(newTask._id);
      }



      await newTodo.save();



      return res.status(200).json({
        newTodo,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: err.message || "Bilinmeyen bir hata oluştu !" });
    }
  }
);






const updateTodoTitle: RequestHandler = asyncHandler( async (req: IReq, res: IRes) => {

    const userId = req.user?.id;
    if(!userId) return res.status(401).json({message: 'Lütfen giriş yapınız !'});

    const {todoId} = req.params;

    const {title} = req.body;


    if(!title) return res.status(400).json({message: 'Güncellenecek başlık bulunamadı !'});
    if(!todoId) return res.status(400).json({message: 'Güncellenecek todo bulunamadı !'});
    


    const todo = await TodoModel.findById(todoId);

    if(!todo) return res.status(404).json({message: 'Böyle bir todo bulunamadı !'});

    if (todo.user.toString() !== userId) return res.status(401).json({message: 'Bu işlem için yetkiniz bulunmamaktadır !'});

    todo.title = title;

    await todo.save();

    return res.status(200).json({todo});

});






const updateTaskCompletedStatus:RequestHandler = asyncHandler( async (req: IReq, res: IRes) => {



      const userId = req.user?.id;
      if (!userId) return res.status(401).json({message: 'Lütfen giriş yapınız !'});

      const {todoId, taskId} = req.params;
     const {completed} = req.body;

      if(!todoId) return res.status(400).json({message: 'Lütfen todo id belirtiniz !'});

      if(!taskId) return res.status(400).json({message: 'Lütfen task id belirtiniz !'});

      if (typeof completed !== 'boolean') return res.status(400).json({message: 'Lütfen tamamlanma durumunu belirtiniz !'});

      const todo = await TodoModel.aggregate([
        {
          $match: {
           user: new mongoose.Types.ObjectId(userId),
           
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
            tasks : {
              _id:1,
              text:1,
              completed:1,

            }
          }
          
        }
      ]);

    
      if(!todo) return res.status(404).json({message: 'Böyle bir todo bulunamadı !'});

      const getMyTodo = todo.find((todo:ITodo) => todo._id.toString() === todoId);


      if ( !getMyTodo ) return res.status(404).json({message: 'Böyle bir todo bulunamadı !'});

      const completedTask = getMyTodo.tasks.find((task:ITask) => task._id.toString() === taskId);

      if(!completedTask) return res.status(404).json({message: 'Task statüsü güncellenemedi !'});

      completedTask.completed = completed;


      const updatedTodoTask = await TaskModel.findOneAndUpdate(
        {_id: taskId},
        {$set: {completed: completed}},
        {new: true, select : {text:1, completed:1, _id:1, todo:1}}

      );

      


      return res.status(200).json({
        message: 'Task statüsü güncellendi !',
        updatedTodoTask
      });



});


const addNewTask: RequestHandler = asyncHandler( async (req: IReq, res: IRes) => {


  try {


  const userId = req.user?.id;
  
  const checkUser = await UserModel.findOne({_id: userId});

  if(!checkUser) return res.status(404).json({message: 'Böyle bir kullanıcı bulunamadı !'});

  const {todoId} = req.params;

  if (!todoId) return res.status(400).json({message: 'Lütfen task eklemek istediğiniz todo için bir id belirtiniz !'});

  const {text} = req.body;

  if (!text || text.length === 0 ) return res.status(400).json({message: 'Lütfen bir task giriniz !'});


  const newTask = new TaskModel({
    todo: todoId,
    text,
    completed:false,
  })

  if (!newTask) return res.status(400).json({message: 'Task eklenemedi !'});

  await newTask.save();

  const updatedTodo = await TodoModel.findOneAndUpdate(
    {_id: todoId},
    {$push: {tasks: newTask._id}},
    {new: true, select: {title:1, tasks:1, _id:1}}
  );
  
  return res.status(200).json({updatedTodo} );

} catch (err: any) {
  return res.status(500).json({message: err.message || 'Bilinmeyen bir hata oluştu !'});
}

});



const deleteTask: RequestHandler = asyncHandler( async (req: IReq, res: IRes) => {

  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Lütfen giriş yapınız !' });

    const { todoId, taskId } = req.params;

    if (!todoId) return res.status(400).json({ message: 'Lütfen todo id belirtiniz !' });
    if (!taskId) return res.status(400).json({ message: 'Lütfen task id belirtiniz !' });

    const todo = await TodoModel.findById(todoId);
    if (!todo) return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });

    if (todo.user.toString() !== userId) return res.status(401).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır !' });

    const task = await TaskModel.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Böyle bir task bulunamadı !' });

    await TaskModel.deleteOne({ _id: taskId });

    const updatedTasks = todo.tasks.filter((taskId: mongoose.Types.ObjectId) => taskId !== task._id.toString());
    todo.tasks = updatedTasks;
    await todo.save();

    return res.status(200).json({ message: 'Task silindi!' });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || 'Bilinmeyen bir hata oluştu !' });
  }

});

const deleteTodo: RequestHandler = asyncHandler( async (req: IReq, res: IRes) => {



try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Lütfen giriş yapınız !' });
  
    const { todoId } = req.params;
  
    if (!todoId) return res.status(400).json({ message: 'Lütfen todo id belirtiniz !' });
  
    const todo = await TodoModel.findOne({ _id: todoId });
    if (!todo) return res.status(404).json({ message: 'Böyle bir todo bulunamadı !' });
  
    if (todo.user.toString() !== userId) return res.status(401).json({ message: 'Bu işlem için yetkiniz bulunmamaktadır !' });
  
    await TodoModel.deleteOne({ _id: todoId });
  
    return res.status(200).json({ message: 'Todo silindi!'});
} catch (error:any) {
  return res.status(500).json({ message: error.message || 'Bilinmeyen bir hata oluştu !' });

  
}








  



});






module.exports = { getTodos, createTodo,updateTaskCompletedStatus,updateTodoTitle, addNewTask,deleteTask,deleteTodo };
