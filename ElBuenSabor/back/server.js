import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productoRouter from './routes/productoRoutes.js';



//fetch con las variables
dotenv.config();

//Conectamos con Mongo
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Conectado a MongoDB ');
  })
  .catch((err) => {
    console.log('Error al conectar con MongoDB: ' + err.message);
  });

const app = express();
app.use('/api/seed', seedRouter);
app.use('/api/productos', productoRouter);
/* app.get('/api/productos', (req, res) => {
  res.send(data.productos);
}); */



const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
