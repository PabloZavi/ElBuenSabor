import bcrypt from 'bcryptjs';

const data = {
  /* users: [
    {
      nombreUsuario: 'Ariel',
      emailUsuario: 'ariel@gmail.com',
      passwordUsuario: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      nombreUsuario: 'Francisco',
      emailUsuario: 'francisco@gmail.com',
      passwordUsuario: bcrypt.hashSync('francisco123'),
      isAdmin: false,
    },
  ], */
  productos: [
    {
      //_id: '1',
      nombreProducto: 'Hamburguesa doble con cheddar',
      tiempoCocinaProducto: 12,
      recetaProducto: 'receta hamburguesa doble con cheddar',
      descripcionProducto: 'descripción hamburguesa doble con cheddar',
      rubroProducto: 'Hamburguesas',
      imagenProducto: '/images/hambdobleconqueso.jpg',
      precioVentaProducto: 451,
      altaProducto: true,
      stockProducto: 0,
    },
    {
      //_id: '2',
      nombreProducto: 'Hamburguesa Guacamole',
      tiempoCocinaProducto: 15,
      recetaProducto: 'receta hamburguesa guacamole',
      descripcionProducto: 'descripción hamburguesa guacamole',
      rubroProducto: 'Hamburguesas',
      imagenProducto: '/images/hambguacamole.jpg',
      precioVentaProducto: 532,
      altaProducto: true,
      stockProducto: 1,
    },
    {
      //_id: '3',
      nombreProducto: 'Hamburguesa de Pollo',
      tiempoCocinaProducto: 22,
      recetaProducto: 'receta hamburguesa pollo',
      descripcionProducto: 'descripción hamburguesa pollo',
      rubroProducto: 'Hamburguesas',
      imagenProducto: '/images/hambpollo.jpg',
      precioVentaProducto: 412,
      altaProducto: true,
      stockProducto: 3,
    },
    {
      //_id: '4',

      nombreProducto: 'Hamburguesa Vegana',
      tiempoCocinaProducto: 22,
      recetaProducto: 'receta hamburguesa vegana',
      descripcionProducto: 'descripción hamburguesa vegana',
      rubroProducto: 'Hamburguesas',
      imagenProducto: '/images/hambvegana.jpg',
      precioVentaProducto: 412,
      altaProducto: true,
      stockProducto: 0,
    },

    {
      nombreProducto: 'Pizza Margarita',
      tiempoCocinaProducto: 33,
      recetaProducto: '2 huevos y un kilo de carne',
      descripcionProducto: 'descripción pizza margarita',
      rubroProducto: 'Pizzas',
      imagenProducto: '/images/pizzamargarita.jpg',
      precioVentaProducto: 412,
      altaProducto: true,
      stockProducto: 5,
    },
  ],
};

export default data;
