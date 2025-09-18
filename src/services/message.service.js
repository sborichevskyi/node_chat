import { Message } from '../data/message.js';

const findRoomsMessages = async (roomId) => {
  const messages = await Message.findAll({ where: { roomId } });

  if (!messages) {
    return [];
  }

  return messages;
};

const mergeMessages = async (roomId, targetRoomId) => {
  const messages = await findRoomsMessages(roomId);

  if (!messages || !messages.length) {
    return { moved: 0 };
  }

  for (const msg of messages) {
    msg.roomId = targetRoomId;
    await msg.save();
  }

  return { moved: messages.length, into: targetRoomId };
};

const sendMessage = async (roomId, userId, text) => {
  const message = {
    text: text.trim(),
    userId: userId,
    roomId: roomId,
  };

  await Message.create(message);

  return message;
};

export const messageService = {
  findRoomsMessages,
  mergeMessages,
  sendMessage,
};
