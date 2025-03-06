import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

//get .env to have access to the database URI
dotenv.config();

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  connectDb();
  console.log("Server started at http://localhost:" + PORT);
});


