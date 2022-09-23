import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function Producto(props) {
  const { producto } = props;
  return (
    <Card>
      <Link to={`/producto/${producto.id}`}>
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.denominacion}
        />
      </Link>
      <Card.Body>
        <Link to={`/producto/${producto.id}`}>
          <Card.Title>{producto.denominacion}</Card.Title>
        </Link>
        <Card.Text>${producto.precioVenta}</Card.Text>
        <Button>Agregar al carrito</Button>
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
