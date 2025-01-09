import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import {
  getOrderById,
  cancelOrder,
  listOrders,
  createOrder,
  listAllOrders,
  changeStatus,
  listUserOrders
} from '../controllers/orders';

const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/', [authMiddleware], errorHandler(listOrders));
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));
orderRoutes.get('/index', [authMiddleware], errorHandler(listAllOrders));
orderRoutes.get('/users/:id', [authMiddleware], errorHandler(listUserOrders));
orderRoutes.put('/:id/status', [authMiddleware], errorHandler(changeStatus));
orderRoutes.put('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;
