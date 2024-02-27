import mongoose, { Schema, model } from "mongoose";

const fileEmbeddingSchema = new Schema({
  embedding: {
    type: [Number] // 384 numbers in the array
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true
  },
  userId: {
    type: String,
    ref: "User",
    required: true
  },
});

export default model("FileEmbedding", fileEmbeddingSchema)
