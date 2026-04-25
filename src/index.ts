import express from "express"
import dotenv from "dotenv";
dotenv.config();
import { errorHandler} from "./middleware/errorHandler";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import { ApiError } from "./utils/appError";
import catogeryRoutes from "./routes/catogeries"

const app = express();


// Middleware
app.use(express.json());
app.use("/v1", adminRouter);
app.use("/v1", authRouter);
app.use("/v1", userRouter);
app.use("/v1", catogeryRoutes)

app.use((req, res, next) => {
    next(new ApiError(404, `The route ${req.originalUrl} does not exist on this server.`));
});

// error handler 
app.use(errorHandler);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}); 