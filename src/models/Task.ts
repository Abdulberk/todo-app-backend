import mongoose, { Schema, Document } from 'mongoose';


export interface ITask extends Document {

    todo: mongoose.Types.ObjectId;
    text: string;
    completed: boolean;

  }

  const TaskSchema: Schema = new Schema(
    {
      todo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',

      },
      text: {
        type: String,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
    },
    {
      timestamps: false,

    }
  );

  const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

    export default TaskModel;