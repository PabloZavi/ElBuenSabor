import React from 'react';
//import IngredientsDropdown from './IngredientsDropdown';
//import MacrosDropdown from './MacrosDropdown';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import IngredientsDropdown from './IngredientsDropdown';

const AddIngredient = ({ ingredientes, ingredienteProducto, updateIngredient, removeIngredient }) => {


  //const macros = [...new Set(ingredients.map(ingredient => ingredient.macro))]
  
  //let ingredientesProducto = []
  
  /* if(mealIngredient.macro){
    ingredientList = ingredients.filter(ingredient => ingredient.macro === mealIngredient.macro)
  }else if(mealIngredient.ingredient) {
    ingredientList = ingredients.filter(ingredient => ingredient.macro === mealIngredient.ingredient.macro)
  } */
  

  /* const selectMacro = (e) => {
    updateIngredient({...mealIngredient, macro: e.target.value})
  } */

  const handleIngredientSelect = (e) => {
    const ingId = parseInt(e.target.value)
    updateIngredient({...ingredienteProducto, ingredient_id: ingId})
  }

  const cantidad = (e) =>{
    const updatedQuantity = parseInt(e.target.value)

    updateIngredient({...ingredienteProducto, quantity:updatedQuantity})
  }

  /* const increaseQuantity = () => {
    
    if(mealIngredient.macro || mealIngredient.ingredient.macro) {
      const updatedQuantity = mealIngredient.quantity + 1
      updateIngredient({...mealIngredient, quantity: updatedQuantity})
    }
  }

  const decreaseQuantity = () => {
    if(mealIngredient.macro || mealIngredient.ingredient.macro) {
      const updatedQuantity = mealIngredient.quantity > 0 ? mealIngredient.quantity -1 : mealIngredient.quantity
      updateIngredient({...mealIngredient, quantity: updatedQuantity})
    }
  } */

  //const displayQuantity = `  ${mealIngredient.quantity}  `
  
  return (
    <Row>
      
      <Col>
        {/* <IngredientsDropdown 
          ingredient={ingredienteProducto}
          handleIngredientSelect={handleIngredientSelect} 
          ingredients={ingredientes} 
        /> */}
        {/* <Select
                defaultValue={
                  { label: ingredienteProducto.nombreIngrediente }}
                options={ingredientes.map((ing) => ({
                  label: ing.nombreIngrediente,
                  value: ing.nombreIngrediente,
                }))}
                onChange={handleIngredientSelect}
              ></Select> */}
              <IngredientsDropdown 
              ingredient={ingredienteProducto}
              handleIngredientSelect={handleIngredientSelect}
              ingredients={ingredientes} />
      </Col>
      <Col>
      <Form.Control
            className="smaller-input"
            type="Number"
            min="0"
            value={cantidad}
            onChange={(e) => {
              cantidad(e)
            }}
            required
          ></Form.Control>
          </Col>
          <Col>
      {ingredienteProducto.unidadDeMedidaIngrediente}
          </Col>
      <Col xs={1}>
        <Button 
          onClick={e => removeIngredient(ingredienteProducto)} 
          variant='outline-dark'
        >x</Button>
      </Col>
    </Row>
  )
}

export default AddIngredient;