import { User } from '../data/user.js';
import { Room } from '../data/room.js';

const findRoomsByUserId = async (userId) => {
  const user = await User.findByPk(userId, {
    include: Room,
  });

  if (!user) {
    return [];
  }

  return user.Rooms;
};

const findRoomById = async (roomId) => {
  const room = await Room.findByPk(roomId);

  if (!room) {
    return null;
  }

  return room;
};

const createRoom = async (name) => {
  const newRoom = Room.create({ name });

  return newRoom;
};

export const roomService = {
  findRoomsByUserId,
  findRoomById,
  createRoom,
};
