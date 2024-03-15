import express, { Request, Response } from "express";
import morgan from "morgan";
import Producer from "./producer";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.post("/send-message", async (req: Request, res: Response) => {
  const { routingKey, message } = req.body;

  const producer = Producer.getInstance();
  const result = await producer.publishMessage(routingKey, message);
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
