import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDb from "./src/config/db.js";

const PORT = config.port || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while starting server", err.message);
    process.exit(1);
  });
