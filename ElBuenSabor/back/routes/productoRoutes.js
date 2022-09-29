import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Producto from '../models/productoModel.js';

const productoRouter = express.Router();

productoRouter.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.send(productos);
});

//Ojo usamos expressAsyncHandler
const PAGE_SIZE = 6; 
productoRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const rubroProducto = query.category || '';
    const searchQuery = query.query || '';

    //Si el nombre existe y es diferente a 'all'...
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            nombreProducto: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter = rubroProducto && rubroProducto !== 'all' ? { rubroProducto } : {};

    const productos = await Producto.find({
      ...queryFilter,
      ...categoryFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProductos = await Producto.countDocuments({
      ...queryFilter,
      ...categoryFilter,
    });

    res.send({
      productos,
      countProductos,
      page,
      pages: Math.ceil(countProductos / pageSize),
    });
  })
);

productoRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Producto.find().distinct('rubroProducto');
    res.send(categories);
  })
);

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
