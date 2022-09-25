import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';

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
    if (data.stockProducto < cantidad) {
      toast.error('No hay stock del producto');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, cantidad },
    });
  };
  return (
    <Card>
      <Link to={`/producto/${producto._id}`}>
        <img
          src={producto.imagenProducto}
          className="card-img-top"
          alt={producto.nombreProducto}
        />
      </Link>
      <Card.Body>
        <Link to={`/producto/${producto.id}`}>
          <Card.Title>{producto.nombreProducto}</Card.Title>
        </Link>
        <Card.Text>${producto.precioVentaProducto}</Card.Text>
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
      {/* <div className="producto-info">
        
        <p>
          <strong>{producto.precioVenta}</strong>
        </p>
        <button>Agregar al carrito</button>
      </div> */}
    </Card>
  );
}

export default Producto;
