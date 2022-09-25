import express from 'express';
import Producto from '../models/productoModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  //removemos todos los productos anteriores
  //await Producto.remove({});          DEPRECATED
  await Producto.deleteMany({});
  //creamos nuevos productos
  const createdProductos = await Producto.insertMany(data.productos);
  res.send({ createdProductos });
});

export default seedRouter;
