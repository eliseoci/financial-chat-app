const Room = require('../repositories/room');
const Message = require('../repositories/message');
const Utils = require('../services/utils');
const QueueService = require('../services/queue');
const getMessageDTO = require('../dto/message');
const getRoomDTO = require('../dto/room');

const Constants = Utils.CONSTANTS;

const handler = (io) => {
  // Rooms
  io.of(`/${Constants.NAMESPACE_ROOMS}`).on(Constants.CONNECTION, async (socket) => {
    // Create room
    socket.on(Constants.CREATE_ROOM, async (title) => {
      const room = await Room.findOne({ title: new RegExp(`^${title}$`, 'i') });
      if (room) {
        socket.emit(Constants.UPDATE_ROOMS_LIST, { error: 'Room already exists.' });
      } else {
        const newRoom = await Room.create({ title });
        const roomDTO = getRoomDTO(newRoom);
        socket.emit(Constants.UPDATE_ROOMS_LIST, roomDTO);
        socket.broadcast.emit(Constants.UPDATE_ROOMS_LIST, roomDTO);
      }
    });
  });

  // Chatroom
  io.of(`/${Constants.NAMESPACE_CHATROOMS}`).on(Constants.CONNECTION, (socket) => {
    // When someone joins a chatroom
    socket.on(Constants.JOIN, async (roomId) => {
      const room = await Room.findById(roomId);
      if (room) {
        // Check if user exists in the session
        if (socket.request.session.passport == null) {
          return;
        }
        const newRoom = await Room.addUserToRoom(room, socket);
        socket.join(newRoom.id);
      }
    });

    // When a socket exits
    socket.on(Constants.DISCONNECT, async () => {
      // Check if user exists in the session
      if (socket.request.session.passport == null) {
        return;
      }
      const room = await Room.removeUserFromRoom(socket);
      socket.leave(room.id);
    });

    // When a bot message arrives
    socket.on(Constants.NEW_BOT_MESSAGE, async (roomId, message) => {
      const msg = await Message.create({ ...message, roomId });
      const messageDTO = getMessageDTO(msg);
      socket.nsp.to(roomId).emit(Constants.ADD_MESSAGE, messageDTO);
    });

    // When a new message arrives
    socket.on(Constants.NEW_MESSAGE, async (roomId, message) => {
      const { content, username } = message;
      const msg = await Message.create({ content, username, roomId });
      const messageDTO = getMessageDTO(msg);

      socket.broadcast.to(roomId).emit(Constants.ADD_MESSAGE, messageDTO);

      const commandRegex = new RegExp('^/');
      // Check if message is a command
      if (Utils.isMatch(content, commandRegex) && content.length > 1) {
        const queue = process.env.QUEUE_NAME;
        const stringifiedMessage = JSON.stringify({ ...message, roomId });
        QueueService.publishToQueue(queue, stringifiedMessage);
      }
    });
  });
};

module.exports = handler;
