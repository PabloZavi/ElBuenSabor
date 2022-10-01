import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Producto from '../models/productoModel.js';
import { isAdmin, isAuth } from '../utils.js';

const productoRouter = express.Router();

productoRouter.get('/', async (req, res) => {
  const productos = await Producto.find();
  res.send(productos);
});

productoRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProducto = new Producto({
      nombreProducto: 'prueba1 ' + Date.now(),
      tiempoCocinaProducto: 15,
      recetaProducto: 'receta ejemplo prueba 1',
      descripcionProducto: 'descripción prueba 1',
      imagenProducto: '/imagenprueba1.jpg',
      precioVentaProducto: 555,
      altaProducto: false,
      rubroProducto: 'rubro prueba 1',
      //Atributo a eliminar:
      stockProducto: 2,
    });
    const producto = await newProducto.save();
    res.send({ message: 'Producto creado', producto });
  })
);

productoRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Producto.findById(productId);
    if (product) {
      product.nombreProducto = req.body.nombreProducto;
      product.tiempoCocinaProducto = req.body.tiempoCocinaProducto;
      product.recetaProducto = req.body.recetaProducto;
      product.descripcionProducto = req.body.descripcionProducto;
      product.imagenProducto = req.body.imagenProducto;
      product.precioVentaProducto = req.body.precioVentaProducto;
      product.altaProducto = req.body.altaProducto;
      product.rubroProducto = req.body.rubroProducto;
      product.stockProducto = req.body.stockProducto;
      await product.save();
      res.send({ message: 'Producto actualizado' });
    } else {
      res.status(404).send({ message: 'Producto no encontrado' });
    }
  })
);

//Ojo usamos expressAsyncHandler
//const PAGE_SIZE = 6;

productoRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || 10; //Elegir cuántos productos mostrar por pantalla
    const productos = await Producto.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProductos = await Producto.countDocuments();
    res.send({
      productos,
      countProductos,
      page,
      pages: Math.ceil(countProductos / pageSize),
    });
  })
);

productoRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || 6; //Elegir cuántos productos se muestran por pantalla
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

    const categoryFilter =
      rubroProducto && rubroProducto !== 'all' ? { rubroProducto } : {};

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
