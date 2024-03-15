import amqplib from "amqplib";

const config = {
  rabbitMQ: {
    url: "amqp://127.0.0.1",
    exchangeName: "loggerExchange",
  },
};

export enum RoutingKeys {
  info = "Info",
  warning = "Warning",
  error = "Error",
}

class Producer {
  private channel: amqplib.Channel | undefined;
  static instance: Producer | undefined;

  static getInstance(): Producer {
    if (!this.instance) {
      this.instance = new Producer();
    }
    return this.instance;
  }

  async createChannel(): Promise<amqplib.Channel> {
    try {
      const connection = await amqplib.connect(config.rabbitMQ.url);
      console.log("✅ Connection to RabbitMQ established");
      this.channel = await connection.createChannel();
      return this.channel;
    } catch (error) {
      console.log("😭 Unable to Connect to RabbitMQ");
      throw error;
    }
  }

  async publishMessage(routingKey: RoutingKeys, message: string) {
    if (!this.channel) await this.createChannel();

    await this.channel!.assertExchange(config.rabbitMQ.exchangeName, "direct");

    const logDetails = {
      logType: routingKey,
      message,
      timestamp: new Date(),
    };
    const buffer = Buffer.from(JSON.stringify(logDetails));
    const isPublished = this.channel!.publish(
      config.rabbitMQ.exchangeName,
      routingKey,
      buffer
    );

    isPublished
      ? console.log(`✅ ${routingKey} Message (${message}) has been sent`)
      : console.log("⚠️ Message not sent");

    return isPublished;
  }
}

export default Producer;
