#!/usr/bin/env node

const request = require('request');
const csv = require('csvtojson');
const amqp = require('amqplib/callback_api');
const io = require('socket.io-client');

require('dotenv').config();

const CONN_URL = process.env.MESSAGE_QUEUE_SERVER_URL;
const QUEUE = process.env.QUEUE_NAME;
const ioServerPort = process.env.SOCKET_IO_PORT;

const processCommand = async (content) => {
  // Get stock code
  const stockCode = content.substring(7);
  const url = `https://stooq.com/q/l/?s=${stockCode}&f=sd2t2ohlcv&h&e=csv`;
  // parse csv
  return csv().fromStream(request.get(url));
};

const emitMessage = (message) => {
  const socket = io(`http://localhost:${ioServerPort}/chatroom`, { transports: ['websocket'] });
  socket.on('connect', () => {
    socket.emit('newBotMessage', message.roomId, message);
  });
};

const formatContent = (stock) => {
  const stockQuote = stock[0];
  // if unknown stock
  if (stockQuote.Close === 'N/D') {
    return `Unknown symbol: ${stockQuote.Symbol}. Please try with another stock.`;
  }
  return `${stockQuote.Symbol} quote is $${stockQuote.Close} per share`;
};

const handleError = (err) => {
  if (err) {
    console.error(err);
  }
};

amqp.connect(CONN_URL, (err, conn) => {
  handleError(err);
  conn.createChannel((error, channel) => {
    handleError(error);
    channel.assertQueue(QUEUE, { durable: true }, (exc, data) => {
      handleError(exc);
      console.log(data);
    });
    channel.prefetch(1);
    channel.consume(QUEUE, async (msg) => {
      const message = JSON.parse(msg.content);
      try {
        console.log(message);
        const stockCommandRegex = new RegExp('^/stock=', 'i');
        if (stockCommandRegex.test(message.content)) {
          const stock = await processCommand(message.content);
          const stockQuote = formatContent(stock);
          message.content = stockQuote;
        } else {
          message.content = 'Unknown command :(';
        }
        message.createdAt = Date.now();
        await emitMessage(message);
      } catch (exception) {
        return;
      }
      channel.ack(msg);
      // return null;
    }, { noAck: false });
  });
});
