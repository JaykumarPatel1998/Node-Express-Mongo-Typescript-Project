import { InferSchemaType, Schema, model } from "mongoose";

//boiler plate item schema
const itemSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    description : {
        type : String
    }
}, {
    timestamps : true
})

type Item = InferSchemaType<typeof itemSchema>

export default model<Item>("Item", itemSchema)