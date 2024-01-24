import { InferSchemaType, Schema, model } from "mongoose";

//boiler plate item schema
const userSchema = new Schema({
    username :{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
}, {
    timestamps : true,
    virtuals : {
        userinfo : {
            get() {
                return `username : ${this.username}, email: ${this.email}` 
            }
        }
    }
})

type User = InferSchemaType<typeof userSchema>

export default model<User>("User", userSchema)