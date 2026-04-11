import express from "express"
import type { Request, Response } from "express"

import dotenv from "dotenv";
dotenv.config();

const app = express();


// Middleware
app.use(express.json());



// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}); 