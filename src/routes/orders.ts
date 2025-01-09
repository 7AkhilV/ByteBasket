import { Router } from 'express';
import { errorHandler } from '../error-handler';
import authMiddleware from '../middlewares/auth';
import {
  getOrderById,
  cancelOrder,
  listOrders,
  createOrder,
} from '../controllers/orders';

const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/', [authMiddleware], errorHandler(listOrders));
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));
orderRoutes.put('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;
