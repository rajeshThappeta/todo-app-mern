import { Schema, model } from "mongoose";
import { hash } from "bcryptjs";

const todoSchema = new Schema(
  {
    taskName: {
      type: String,
      reauired: true,
    },
    description:{
      type:String,
      required:true
    },

    status: {
      type: String,
      required: true,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already existed"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [4, "Length of Password should be above 4 characters"],
    },
    todos: { type: [todoSchema], required: true },
  },
  {
    versionKey: false,
    timestamps: false,
    strict: true,
  }
);

UserSchema.pre("save", async function (next) {
  // Only run this function if the password was modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  //  Hash the password
  this.password = await hash(this.password, 12);

  next();
});

//Model
export const UserModel = model("user", UserSchema);
