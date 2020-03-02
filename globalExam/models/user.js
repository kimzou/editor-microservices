import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    roles: {
        type: String,
        enum: ["STUDENT", "INSTRUCTOR", "ADMIN"],
    },
});
const user = mongoose.model('User', UserSchema);
export default user;