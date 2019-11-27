const amqp = require('amqplib/callback_api');

let channel;
amqp.connect(process.env.MESSAGE_QUEUE_SERVER_URL, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((error, newChannel) => {
    if (error) {
      throw error;
    }
    const queue = process.env.QUEUE_NAME;
    channel = newChannel;
    channel.assertQueue(queue, {
      durable: true,
    });
  });
});

process.on('exit', () => {
  channel.close();
  console.log('Closing rabbitmq channel');
});

exports.publishToQueue = (queue, msg) => {
  channel.sendToQueue(queue, Buffer.from(msg), {
    persistent: true,
  });
  console.log(' [x] Sent %s', msg);
};
