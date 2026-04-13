import express from "express"
import dotenv from "dotenv";
dotenv.config();
import { errorHandler} from "./middleware/errorHandler";
import{run} from "./services/mail"

const app = express();


// Middleware
app.use(express.json());

run();


// error handler 
app.use(errorHandler);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}); 