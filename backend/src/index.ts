import express from "express";
import { testDBConnection } from "./config/db";
import routes from "./routes";
import cors from "cors";
import { PORT } from "./config/enviornment";

const app = express();
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

testDBConnection();

app.use(express.json());

app.use("/api/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
