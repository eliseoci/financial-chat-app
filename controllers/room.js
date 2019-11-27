const RoomRepository = require('../repositories/room');
const MessageRepository = require('../repositories/message');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await RoomRepository.find();
    return res.render('rooms', { rooms });
  } catch (err) {
    return next(err);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await RoomRepository.findById(roomId);
    if (!room) {
      return next();
    }
    const messages = await MessageRepository.getLastMessages({ roomId });
    return res.render('chatroom', { user: req.user, room, messages });
  } catch (err) {
    return next(err);
  }
};
