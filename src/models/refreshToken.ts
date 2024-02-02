import mongoose, { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid'

interface User {
  _id?: mongoose.Types.ObjectId
}

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  
},
  {
    methods: {
      verifyExpiration() {
        return this.expiryDate.getTime() < new Date().getTime();
      }
    },
    statics: {
      async createToken(user : User) {
        const expiredAt = new Date();

        expiredAt.setSeconds(
          expiredAt.getSeconds() + Number.parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY!)
        );

        const _token = uuidv4();

        const _object = new this({
          token: _token,
          user: user._id,
          expiryDate: expiredAt.getTime(),
        });

        const refreshToken = await _object.save();

        return refreshToken.token;
      }
    }
  }
);

// type RefreshToken = InferSchemaType<typeof refreshTokenSchema>

export default model("RefreshToken", refreshTokenSchema)
