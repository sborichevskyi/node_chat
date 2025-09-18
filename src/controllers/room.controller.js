import { messageService } from '../services/message.service.js';
import { roomService } from '../services/room.service.js';
import { Message } from '../data/message.js';
import { userService } from '../services/user.service.js';

const getRoomInfoByRoomId = async (req, res) => {
  const { roomId } = req.params;
  const room = await roomService.findRoomById(roomId);
  const messages = await messageService.findRoomsMessages(roomId);

  if (!roomId || !room) {
    return res.status(404).json({ message: 'Room not Found' });
  }

  if (!messages) {
    return res.status(400).json({ message: 'Cannot get messages' });
  }

  const roomInfo = {
    room: {
      id: room.id,
      name: room.name,
    },
    messages,
  };

  if (!roomInfo) {
    return res.status(400).json({ message: 'Cannot transfer rooms info' });
  }

  return res.status(200).json(roomInfo);
};

const createRoom = async (req, res) => {
  const { name } = req.body;
  const user = req.user;

  if (!name) {
    return res.status(400).json({ message: 'Room name is required' });
  }

  const newRoom = await roomService.createRoom(name);

  if (!newRoom) {
    return res.status(400).json({ message: 'Cannot create the room' });
  }

  await newRoom.addUser(user);

  const roomUsers = await newRoom.getUsers();
  const roomInfo = {
    room: { id: newRoom.id, name: newRoom.name },
    members: roomUsers,
  };

  return res.status(201).json(roomInfo);
};

const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const room = await roomService.findRoomById(roomId);

  if (!roomId || !room) {
    return res.status(404).json({ message: 'Room not Found' });
  }

  await room.setUsers([]);
  await Message.destroy({ where: { roomId: room.id } });
  await room.destroy();

  res.status(200).json({ message: 'Room deleted successfully' });
};

const renameRoom = async (req, res) => {
  const room = req.room;
  const { newName } = req.body;

  if (!room) {
    return res.status(404).json({ message: 'Room not Found' });
  }

  if (!newName || typeof newName !== 'string' || !newName.trim()) {
    return res.status(400).json({ message: 'Invalid room name provided' });
  }

  room.name = newName.trim();
  await room.save();

  return res.status(200).json(room);
};

const mergeRooms = async (req, res) => {
  const currentRoom = req.room;
  const user = req.user;
  const { targetRoomId } = req.body;

  const usersRooms = await roomService.findRoomsByUserId(user.id);
  const targetRoom = usersRooms.find(
    (r) => r.id === parseInt(targetRoomId, 10),
  );

  if (!currentRoom) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (!targetRoomId) {
    return res.status(400).json({ error: 'No targetRoomId provided' });
  }

  if (!targetRoom) {
    return res.status(403).json({ error: 'The user doesnt have access' });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await userService.mergeUsers(currentRoom.id, targetRoomId);
  await messageService.mergeMessages(currentRoom.id, targetRoomId);
  await currentRoom.setUsers([]);
  await currentRoom.destroy();

  return res.status(200).json(targetRoom);
};

export const roomController = {
  getRoomInfoByRoomId,
  createRoom,
  deleteRoom,
  renameRoom,
  mergeRooms,
};
