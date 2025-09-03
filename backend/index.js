import 'dotenv/config';
import { config } from 'dotenv';
import connectDB from "./db/connection.js";
import { app } from "./app.js";

config({ path: ".env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Server failed to start", err);
  });
