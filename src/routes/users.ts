import { Router } from 'express';
import { errorHandler } from '../error-handler';
import { addAddress,updateAddress, deleteAddress, listAddress } from '../controllers/users';
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

export default usersRoutes;
