import express from 'express';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

const orderRouter = express.Router();

orderRouter.post(
  //Uso el middleware 'isAuth' que filtrará el user request _id de abajo
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      //Convierto el id a producto, ya que en el modelo 'orderModel', cada 'orderItem'
      //tiene un producto
      orderItems: req.body.orderItems.map((x) => ({ ...x, producto: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      discount: req.body.discount,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      //Esta info la tengo después de que el middleware 'isAuth' verifica el token
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'Nueva orden creada', order });
  })
);

export default orderRouter;
