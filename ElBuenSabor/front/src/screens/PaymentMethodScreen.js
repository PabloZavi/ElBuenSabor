import React, { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'MercadoPago'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      //Si no existe todavía una dirección, volver a shipping (anterior)
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]); //Acordarse de siempre poner las variables que usamos en un useEffect

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <Helmet>
          <title>Método de pago</title>
        </Helmet>
        <h1 className="my-3">Método de pago</h1>
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="MercadoPago"
              label="Mercado Pago"
              value="MercadoPago"
              checked={paymentMethodName === 'MercadoPago'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Efectivo"
              label="Efectivo en local (10% de descuento)"
              value="Efectivo"
              checked={paymentMethodName === 'Efectivo'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div>
          <div className="mb-3">
            <Button type="submit">Continuar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
