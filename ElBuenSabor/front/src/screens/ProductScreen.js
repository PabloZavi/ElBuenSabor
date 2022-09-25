import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const params = useParams();
  const { _id } = params;

  const [{ loading, error, producto }, dispatch] = useReducer(reducer, {
    producto: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/productos/${_id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [_id]);

  //Para agregar un ítem al carrito de compras necesito primero tener el contexto, entonces...
  //definimos el state y renombramos dispatch por ctxDispatch para distinguirlo del dispatch
  //de este componente en el reducer (arriba) y...
  //usamos useContext para acceder al estado del context y cambiarlo
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //Antes de agregar algo al carrito, vemos que no esté ya agregado
  //Traemos 'cart' desde state y la usamos en addCartToHandler
  const { cart } = state;
  //Esta será la función que se ejecuta al hacer clic en "Agregar al carrito"
  const addToCartHandler = async () => {
    //Comprobamos si ya existe en el carrito el item que queremos agregar
    const existItem = cart.cartItems.find((x) => x._id === producto._id);
    //si existe le agregamos 1 a la cantidad, si no la ponemos en 1
    const cantidad = existItem ? existItem.cantidad + 1 : 1;
    //Nos traemos los datos del producto que queremos agregar...
    const { data } = await axios.get(`/api/productos/${producto._id}`);
    //y verificamos si hay stock
    if (data.stock < cantidad) {
      window.alert('No hay stock del producto');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...producto, cantidad },
    });
    //Después del dispatch del producto lo redirigimos al carrito
    //usaremos el hook navigate de react-router-dom (definimos esta lógica al inicio de 'ProductScreen' -arriba-)
    navigate('/cart');
  };

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
            src={producto.imagenProducto}
            alt={producto.nombreProducto}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{producto.nombreProducto}</title>
              </Helmet>
              <h1>{producto.nombreProducto}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>$ {producto.precioVentaProducto}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>{producto.descripcionProducto}</p>
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
                    <Col>$ {producto.precioVentaProducto}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Estado: </Col>
                    <Col>
                      {producto.stockProducto > 0 ? (
                        <Badge bg="success"> Disponible </Badge>
                      ) : (
                        <Badge bg="danger"> Sin stock </Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {producto.stockProducto > 0 && (
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
