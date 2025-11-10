import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRouter } from "./routes/UserRoutes.js";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { UserModel } from "./models/UserModel.js";
import { verifyToken } from "./middlewares/verifyToken.js";
config();

const dbUrl = process.env.DB_URL;
const port = process.env.PORT || 8080;

const app = exp();
app.use(exp.json());
app.use(cookieParser())
app.use(cors({origin:['http://localhost:5173'],credentials:true}))
app.use("/user-api", userRouter);

connect(dbUrl)
  .then(() => {
    console.log("Connected to Tasks Database successfully");
    app.listen(port, () => console.log(`server listening on port ${port}`));
  })
  .catch((err) => console.log("Err in DB connect :", err));

app.use((err, req, res, next) => {
  console.error("Error Name:", err.name); // Log the error type

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // 1. Check for Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400; // Client-side error
    message = "Validation Failed";

    // Mongoose stores individual field errors in err.errors
    // Object.values() gets the individual error objects
    // map() extracts the user-friendly 'message' property from each
    errors = Object.values(err.errors).map((val) => val.message);

    // Use the first specific error message for the primary response message
    message = errors[0];
  }
  // 2. Handle Unique Field (Duplicate Key) Error
  else if (err.code === 11000) {
    statusCode = 400; // Client-side error
    // Extract the field name that caused the duplicate key error
    const field = Object.keys(err.keyValue).join(", ");
    message = `The field(s) [${field}] must be unique.`;
  }
  // 3. Handle General Errors (CastError, etc.)
  else {
    // Use the default status and message defined above
    // You can add logic for other error types here
  }

  // Send the response
  res.status(statusCode).json({
    success: false,
    message: message, // Now contains only the specific message or a customized message
    // Optionally send all specific errors if there are multiple validation failures
    details: errors.length > 0 ? errors : undefined,
  });
});


//page refresh route
app.get("/refresh",verifyToken,async(req,res)=>{
  console.log(req.user)
  let userObj=await UserModel.findById(req.user.user?._id)
  let { password, ...userWithoutPassword } = userObj.toObject();
  res.status(200).json({ success: true, payload: userWithoutPassword });
})
