import mongoose, { Schema, Document } from 'mongoose';



export interface ITodo extends Document {
  title: string;
  tasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  user : mongoose.Types.ObjectId;
}



const TodoSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    title: {
      type: String,
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


const TodoModel = mongoose.model<ITodo>('Todo', TodoSchema);

export default TodoModel;
