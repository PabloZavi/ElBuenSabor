import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';

function Producto(props) {
  const { producto } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    //Comprobamos si ya existe en el carrito el item que queremos agregar
    const existItem = cartItems.find((x) => x._id === producto._id);
    //si existe le agregamos 1 a la cantidad, si no la ponemos en 1
    const cantidad = existItem ? existItem.cantidad + 1 : 1;
    const { data } = await axios.get(`api/productos/${item._id}`);
    //OJO CAMBIAR LÓGICA, AHORA CON INGREDIENTES!
    /* if (data.stockProducto < cantidad) {
      toast.error('No hay stock del producto');
      return;
    } */
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, cantidad },
    });
  };
  return (
    <div className="text-center">
      <Card style={{ width: '18rem', height: '24rem' }}>
        <Link to={`/producto/${producto._id}`}>
          <img
            src={producto.imagenProducto}
            className="card-img-top producto-img3"
            alt={producto.nombreProducto}
          />
        </Link>
        <Card.Body>
          <Link to={`/producto/${producto._id}`}>
            <Card.Title>{producto.nombreProducto}</Card.Title>
          </Link>
          <Card.Text>${producto.precioVentaProducto}</Card.Text>
          <Card.Text>
            <Row>
              <Col>
                {producto.isCeliaco && (
                  <h6>
                    <Badge bg="success"> Apto celíacos </Badge>
                  </h6>
                )}
              </Col>
              <Col>
                {producto.isVegetariano && (
                  <h6>
                    <Badge bg="success"> Apto vegetarianos </Badge>
                  </h6>
                )}
              </Col>
            </Row>
          </Card.Text>
          {/* OJO CAMBIAR LÓGICA, AHORA CON INGREDIENTES! */}
          {producto.stockProducto === 0 ? (
            <Button variant="light" disabled>
              Sin stock
            </Button>
          ) : (
            <Button onClick={() => addToCartHandler(producto)}>
              Agregar al carrito
            </Button>
          )}
        </Card.Body>
        
      </Card>
    </div>
  );
}

export default Producto;
