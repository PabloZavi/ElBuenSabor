import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShipingAdressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //Me traigo del estado el shippingAdress que está en el cart (si es que existe)
  //para usar la info en los hooks
  const {
    userInfo,
    cart: { shippingAdress },
  } = state;

  const [fullName, setFullName] = useState(shippingAdress.fullName || '');
  const [adress, setAdress] = useState(shippingAdress.adress || '');
  const [location, setLocation] = useState(shippingAdress.location || '');
  const [phone, setPhone] = useState(shippingAdress.phone || '');

  //Si el usuario no está logueado, no podré ingresar a shippingAdress
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADRESS',
      payload: {
        fullName,
        adress,
        location,
        phone,
      },
    });
    localStorage.setItem(
      'shippingAdress',
      JSON.stringify({
        fullName,
        adress,
        location,
        phone,
      })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Dirección</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Dirección</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nombre y apellido</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="adress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="location">
            <Form.Label>Localidad</Form.Label>
            <Form.Control
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
