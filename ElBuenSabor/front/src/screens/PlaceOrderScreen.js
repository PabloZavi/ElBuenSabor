import React, { useContext, useEffect } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.cantidad * c.precioVentaProducto, 0)
  );
    
  cart.taxPrice = round2(0.21 * cart.itemsPrice);
  cart.discount = cart.paymentMethod === 'Efectivo' ? -round2((cart.itemsPrice + cart.taxPrice)*0.10) : round2(0);
  cart.totalPrice = cart.itemsPrice + cart.discount + cart.taxPrice;

  const placeOrderHandler = async () => {};

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <Helmet>
        <title>Resumen del pedido</title>
      </Helmet>
      <h1 className="my-3">Resumen del pedido</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dirección de entrega</Card.Title>
              <Card.Text>
                <strong>Nombre: </strong> {cart.shippingAddress.fullName} <br />
                <strong>Dirección: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.location}
                <br />
                <strong>Teléfono: </strong>
                {cart.shippingAddress.phone}
              </Card.Text>
              <Link to="/shipping">Editar</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pago</Card.Title>
              <Card.Text>
                <strong>Forma de pago: </strong> {cart.paymentMethod} <br />
              </Card.Text>
              <Link to="/payment">Editar</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.imagenProducto}
                          alt={item.nombreProducto}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/producto/${item._id}`}>
                          {item.nombreProducto}
                        </Link>
                      </Col>
                      <Col md={1}>
                        <span>{item.cantidad}</span>
                      </Col>
                      <Col md={2}>$ {item.precioVentaProducto}</Col>
                      <Col md={2}>$ {item.cantidad * item.precioVentaProducto}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Editar</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumen</Card.Title>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Productos</Col>
                    <Col>$ {cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                
                <ListGroup.Item>
                  <Row>
                    <Col>IVA</Col>
                    <Col>$ {cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Descuento</Col>
                    <Col>$ {cart.discount.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>$ {cart.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Confirmar Orden
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
