import amqplib from "amqplib";

const config = {
  rabbitMQ: {
    url: "amqp://127.0.0.1",
    exchangeName: "loggerExchange",
  },
};

async function createChannel() {
  try {
    const connection = await amqplib.connect(config.rabbitMQ.url);
    return await connection.createChannel();
  } catch (error) {
    console.log("😭 Unable to Connect to RabbitMQ");
    throw error;
  }
}

async function consumeMessages() {
  // 1) create connection and channel

  const channel = await createChannel();

  await channel.assertExchange(config.rabbitMQ.exchangeName, "direct");

  // 3) create queue
  const q = await channel.assertQueue("infoQueue");

  // 4) bind queue to exchange
  await channel.bindQueue(q.queue, config.rabbitMQ.exchangeName, "Info");

  // 5) consume messages
  channel.consume(q.queue, (msg) => {
    if (msg?.content) {
      const data = JSON.parse(msg.content.toString());
      console.log("Received Message", data);
      channel.ack(msg);
    }
  });
}

export default consumeMessages;
