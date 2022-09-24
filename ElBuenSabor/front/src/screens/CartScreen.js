import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  return (
    <div>
      <Helmet>
        <title>Carrito de compras</title>
      </Helmet>
      <h1>Carrito de compras</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              El carrito está vacío. <Link to="/"> Ver productos </Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.imagen}
                        alt={item.denominacion}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/producto/${item._id}`}>
                        {item.denominacion}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Button variant="light" disabled={item.cantidad === 1}>
                        <i className="bi bi-file-minus-fill"></i>
                      </Button>{' '}
                      <span>{item.cantidad}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.cantidad === item.stock}
                      >
                        <i className="bi bi-file-plus-fill"></i>
                      </Button>
                    </Col>
                    <Col md={3}>$ {item.precioVenta}</Col>
                    <Col md={2}>
                      <Button variant="light">
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.cantidad, 0)}{' '}
                    productos) : $
                    {cartItems.reduce(
                      (a, c) => a + c.precioVenta * c.cantidad,
                      0
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      disabled={cartItems.length === 0}
                    >
                      Ir al pago
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
