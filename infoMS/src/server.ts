import express, { Request, Response } from "express";
import morgan from "morgan";
import consumeMessages from "./consumer";

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

consumeMessages();
