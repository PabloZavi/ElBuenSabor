import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombreProducto: { type: String, required: true, unique: true },
    tiempoCocinaProducto: { type: Number, required: true },
    recetaProducto: { type: String, required: true },
    descripcionProducto: { type: String, required: true },
    imagenProducto: { type: String, required: true },
    precioVentaProducto: { type: Number, required: true },
    altaProducto: { type: Boolean, required: true },
    //Atributo a eliminar:
    stockProducto: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;