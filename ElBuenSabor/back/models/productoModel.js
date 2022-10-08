import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombreProducto: { type: String, required: true, unique: true },
    tiempoCocinaProducto: { type: Number, required: true },
    recetaProducto: { type: String },
    descripcionProducto: { type: String },
    imagenProducto: { type: String },
    precioVentaProducto: { type: Number, required: true },
    altaProducto: { type: Boolean, required: true },
    isCeliaco: { type: Boolean, required: true },
    isVegetariano: { type: Boolean, required: true },
    rubroProducto: { type: String, required: true },
    //Atributo a eliminar:
    stockProducto: { type: Number, required: true },
    //rubroProducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Rubro', required: true },
  },
  {
    timestamps: true,
  }
);

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;
