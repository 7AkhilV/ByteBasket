import { Router } from 'express';
import { errorHandler } from '../error-handler';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  listAddress,
  changeUserRole,
  listUsers,
  getUserById,
} from '../controllers/users';
import authMiddleware from '../middlewares/auth';

const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress));
usersRoutes.put('/address', [authMiddleware], errorHandler(updateAddress));
usersRoutes.delete(
  '/address/:id',
  [authMiddleware],
  errorHandler(deleteAddress)
);
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress));

usersRoutes.put('/:id/role', [authMiddleware], errorHandler(changeUserRole));
usersRoutes.get('/', [authMiddleware], errorHandler(listUsers));
usersRoutes.get('/:id', [authMiddleware], errorHandler(getUserById));

export default usersRoutes;
