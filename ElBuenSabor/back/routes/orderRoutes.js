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

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Busca todas las órdenes que tengan como usuario al que le pasamos
    //OJO el user viene desde el middleware 'isAuth'!!!
    const orders = await Order.find({user: req.user._id});
    res.send(orders);
  
  })
);

orderRouter.get(
  //Uso el middleware 'isAuth' que filtrará el user request _id de abajo
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Buscamos el pedido en la base de datos
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Pedido no encontrado' });
    }
  })
);



orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.payment_id = req.body.payment_id;
      
      const updatedOrder = await order.save();
      res.send({ message: 'Pedido pagado', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Pedido no encontrado' });
    }
  })
); 

export default orderRouter;
