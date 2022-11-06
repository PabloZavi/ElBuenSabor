import mongoose, { Schema } from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombreProducto: { type: String, required: true, unique: true },
    tiempoCocinaProducto: { type: Number, required: true, min: 0 },
    recetaProducto: { type: String },
    descripcionProducto: { type: String },
    imagenProducto: { type: String },
    precioVentaProducto: { type: Number, required: true, min: 0 },
    altaProducto: { type: Boolean, required: true },
    isCeliaco: { type: Boolean, required: true },
    isVegetariano: { type: Boolean, required: true },
    rubroProducto: { type: String, required: true },
    //Atributo a eliminar:
    //stockProducto: { type: Number, required: true },
    ingredientes: [
      {
        ingrediente: { type: Schema.Types.ObjectId, ref: 'Ingrediente' },
        cantidad: { type: Number, min: 0 },
      },
    ],
    //rubroProducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Rubro', required: true },
  },
  {
    timestamps: true,
  }
);

const Producto = mongoose.model('Producto', productoSchema);
export default Producto;
