import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { addAddress, deleteAddress, listAddress } from '../controllers/users';
import authMiddleware from '../middlewares/auth';

const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
usersRoutes.delete(
  '/address/:id',
  [authMiddleware],
  errorHandler(deleteAddress)
);
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress));

export default usersRoutes;
