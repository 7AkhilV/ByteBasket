import { Request, Response } from 'express';
import { prismaClient } from '..';
import { NotFoundException } from '../exceptions/not-found';
import { ErrorCode } from '../exceptions/root';

export const createOrder = async (req: Request, res: Response) => {
  try {
    return await prismaClient.$transaction(async (tx) => {
      const cartItems = await tx.cartIem.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          product: true,
        },
      });

      if (cartItems.length === 0) {
        return res.json({ message: 'Cart is empty' });
      }

      const price = cartItems.reduce((prev, current) => {
        return prev + current.quantity * +current.product.price;
      }, 0);

      const address = await tx.address.findFirst({
        where: {
          id: req.user.defaultShippingAddress,
        },
      });

      if (!address) {
        return res.json({ message: 'Address not found' });
      }

      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          netAmount: price,
          address: address.formattedAddress,
          products: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });

      const orderEvent = await tx.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });

      // Delete cart items after the order is created
      await tx.cartIem.deleteMany({
        where: {
          userId: req.user.id,
        },
      });

      return res.json({ message: 'Order created successfully', order });
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    // Find the order to ensure it exists
    const order = await prismaClient.order.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    // If the order is not found, return a Not Found error
    if (!order) {
      throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
    }

    // Update the order status to 'CANCELLED'
    const updatedOrder = await prismaClient.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: 'CANCELLED',
      },
    });

    // Create a new event to log the order cancellation
    await prismaClient.orderEvent.create({
      data: {
        orderId: updatedOrder.id,
        status: 'CANCELLED',
      },
    });

    res.json(updatedOrder);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.query.status;

  if (status) {
    whereClause = {
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip) || 0,
    take: Number(req.query.take) || 5,
  });
  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const status = req.query.status as string;
    const skip = Math.max(Number(req.query.skip) || 0, 0);
    const take = Math.min(Math.max(Number(req.query.take) || 5, 1), 50);

    let whereClause: any = { userId };
    if (status) {
      whereClause = {
        ...whereClause,
        status,
      };
    }

    const orders = await prismaClient.order.findMany({
      where: whereClause,
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // Sort orders by creation date
      },
    });

    res.json(orders);
  } catch (err) {
    throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
  }
};
