import React from 'react';
import { Form } from 'react-bootstrap';

const IngredientsDropdown = ({
  ingredient = 0,
  ingredients,
  handleIngredientSelect,
}) => {
  const renderIngredients = ingredients.map((ingredient) => {

    return (
      <option 
      key={ingredient.id} 
      value={ingredient.id}>
        {ingredient.nombreIngrediente}
      </option>
    );
  });

  return (
    <Form.Group className="mb-3" controlId="formIngredient">
      <Form.Select
        defaultValue={ingredient.id ? ingredient.id : 0}
        onChange={handleIngredientSelect}
        aria-label="Ingredients"
      >
        <option>Seleccionar ingrediente</option>
        {renderIngredients}
      </Form.Select>
    </Form.Group>
  );
};

export default IngredientsDropdown;
