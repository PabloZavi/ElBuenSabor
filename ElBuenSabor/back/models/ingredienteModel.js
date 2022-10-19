import mongoose from 'mongoose';

const ingredienteSchema = new mongoose.Schema(
  {
    nombreIngrediente: { type: String, required: true, unique: true },
    stockMinimoIngrediente: { type: Number, required: true },
    stockActualIngrediente: { type: Number, required: true },
    unidadDeMedidaIngrediente: { type: String, required: true },
    precioCostoIngrediente: { type: Number, required: true },
    altaIngrediente: { type: Boolean, required: true },
    rubroIngrediente: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);
export default Ingrediente;
