import mongoose, { Schema, Document} from 'mongoose';


interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}



const UserSchema:Schema = new Schema({
    username: {
        type: String,
        required: true,
     

    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,

    },
    createdAt: {
        type: Date,
        default: Date.now,

    },
    updatedAt: {
        type: Date,
        default: Date.now,

    },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
