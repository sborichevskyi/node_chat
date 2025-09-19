import express from 'express';
import { isAuth } from '../midlewares/isAuth.js';
import { isUserInRoom } from '../midlewares/isUserInRoom.js';
import { catchError } from '../utils/catchError.js';
import { roomController } from '../controllers/room.controller.js';

export const roomRouter = express.Router();

roomRouter.get(
  '/:roomId',
  isAuth,
  isUserInRoom,
  catchError(roomController.getRoomInfoByRoomId),
);

roomRouter.post('/', isAuth, catchError(roomController.createRoom));

roomRouter.delete(
  '/:roomId',
  isAuth,
  isUserInRoom,
  catchError(roomController.deleteRoom),
);

roomRouter.patch(
  '/:roomId',
  isAuth,
  isUserInRoom,
  catchError(roomController.renameRoom),
);

roomRouter.post(
  '/:roomId/merge',
  isAuth,
  isUserInRoom,
  catchError(roomController.mergeRooms),
);

roomRouter.post('/:roomId/join', isAuth, roomController.joinRoom);
