import express from 'express';
import Producto from '../models/productoModel.js';

const productoRouter = express.Router();

productoRouter.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.send(productos);
});

//Busco un producto por su id
productoRouter.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      res.send(producto);
    } else {
      res.status(404).send({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

//Busco productos por nombre
productoRouter.get('/nombre/:nombre', async (req, res) => {
  const productos = await Producto.find({ nombreProducto: req.params.nombre });
  if (productos) {
    res.send(productos);
  } else {
    res
      .status(404)
      .send({ message: 'No existen productos con ese parámetro de búsqueda' });
  }
});

export default productoRouter;
