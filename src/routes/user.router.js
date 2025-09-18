import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { catchError } from '../utils/catchError.js';
import { isAuth } from '../midlewares/isAuth.js';
import { isNotAuth } from '../midlewares/isNotAuth.js';

export const userRouter = express.Router();

userRouter.post('/', isNotAuth, catchError(userController.createUser));
userRouter.get('/:userId', isAuth, catchError(userController.getUserInfo));
userRouter.patch('/:userId', isAuth, catchError(userController.changeUserName));
userRouter.delete('/:userId', isAuth, catchError(userController.deleteUser));
