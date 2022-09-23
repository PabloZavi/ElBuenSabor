import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

//reducer acepta dos parámetros, el primero es el estado actual y el segundo es la acción que cambia
//el estado y crea un nuevo estado
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, producto: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { id } = params;

  const [{ loading, error, producto }, dispatch] = useReducer(reducer, {
    producto: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/productos/id/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [id]);

  //Para agregar un ítem al carrito de compras necesito primero tener el contexto, entonces...
  //definimos el state y renombramos dispatch por ctxDispatch para distinguirlo del dispatch
  //de este componente en el reducer (arriba) y...
  //usamos useContext para acceder al estado del context y cambiarlo
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //Esta será la función que se ejecuta al hacer clic en "Agregar al carrito"
  const addToCartHandler = () =>
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...producto, cantidad: 1 },
    });

  return loading ? (
    //<div>Cargando...</div>
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={producto.imagen}
            alt={producto.denominacion}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{producto.denominacion}</title>
              </Helmet>
              <h1>{producto.denominacion}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>$ {producto.precioVenta}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>{producto.descripcion}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Precio: </Col>
                    <Col>$ {producto.precioVenta}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Estado: </Col>
                    <Col>
                      {producto.stock > 0 ? (
                        <Badge bg="success"> Disponible </Badge>
                      ) : (
                        <Badge bg="danger"> Sin stock </Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {producto.stock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Agregar al carrito
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default ProductScreen;
