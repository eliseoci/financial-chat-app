const Room = require('../database').models.room;

const create = (data) => {
  const newRoom = new Room(data);
  return newRoom.save();
};

const find = (data) => Room.find(data);

const findOne = (data) => Room.findOne(data);

const findById = (id) => Room.findById(id);

const addUserToRoom = (room, socket) => {
  const { userId } = socket.request.session.passport;
  const newConnection = { userId, socketId: socket.id };
  room.connections.push(newConnection);
  return room.save();
};

const removeUserFromRoom = async (socket) => {
  const rooms = await find();
  for (let i = 0; i < rooms.length; i += 1) {
    const room = rooms[i];
    for (let j = 0; j < room.connections.length; j += 1) {
      const connection = room.connections[j];
      if (connection.socketId === socket.id) {
        // eslint-disable-next-line no-underscore-dangle
        room.connections.id(connection._id).remove();
        // eslint-disable-next-line no-await-in-loop
        return room.save();
      }
    }
  }
  throw Error('Connection not found');
};

module.exports = {
  create,
  find,
  findOne,
  findById,
  addUserToRoom,
  removeUserFromRoom,
};
