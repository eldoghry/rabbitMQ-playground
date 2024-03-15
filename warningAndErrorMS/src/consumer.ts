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
  // 1) create connection
  const connection = await amqplib.connect(config.rabbitMQ.url);

  // 2) create channel and exchange
  const channel = await connection.createChannel();
  await channel.assertExchange(config.rabbitMQ.exchangeName, "direct");

  //4) create queue
  const q = await channel.assertQueue("warningQueue");

  // 5) bind queue to exchange, binding 2 routing keys
  await channel.bindQueue(q.queue, config.rabbitMQ.exchangeName, "Warning");
  await channel.bindQueue(q.queue, config.rabbitMQ.exchangeName, "Error");

  channel.consume(q.queue, (msg) => {
    if (msg?.content) {
      const data = JSON.parse(msg.content.toString());
      console.log("Received Message", data);
      channel.ack(msg);
    }
  });
}

export default consumeMessages;
