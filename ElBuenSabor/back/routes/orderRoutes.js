import express from 'express';
import { isAuth, isAdmin } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Producto from '../models/productoModel.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'nombreUsuario');
    res.send(orders);
  })
);

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
      shippingOption: req.body.shippingOption,
      totalCost: req.body.totalCost,
      //Esta info la tengo después de que el middleware 'isAuth' verifica el token
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'Nueva orden creada', order });
  })
);

//Ojo, en esta ruta verificamos que además de estar autenticado, sea admin
orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      //pipeline
      {
        $group: {
          _id: null, //null=todos
          numOrders: { $sum: 1 }, //suma todos los ítems
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%d-%m-%Y', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Producto.aggregate([
      {
        $group: {
          _id: '$rubroProducto',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Busca todas las órdenes que tengan como usuario al que le pasamos
    //OJO el user viene desde el middleware 'isAuth'!!!
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  //Uso el middleware 'isAuth' que filtrará el user request _id de abajo
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Buscamos el pedido en la base de datos
    const order = await Order.findById(req.params.id).populate(
      'user',
      'nombreUsuario' 
    ).populate('orderItems.producto');
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Pedido no encontrado' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Pedido entregado!' });
    } else {
      res.status(404).send({ message: 'Pedido no encontrado' });
    }
  })
);

orderRouter.put(
  '/:id/state',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const state = req.body.estado;
    if (order) {
      order.estadoPedido = state;
      if(state==='Entregado') {
        order.isDelivered = true;
      order.deliveredAt = Date.now();
      }
      await order.save();
      res.send({ message: 'Estado actualizado! : ' + req.body.estado});
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

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Pedido eliminado' });
    } else {
      res.status(404).send({ message: 'Pedido no encontrado' });
    }
  })
);

export default orderRouter;
