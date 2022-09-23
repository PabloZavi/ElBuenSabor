import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
//import data from '../data';

//reducer acepta dos parámetros, el primero es el estado actual y el segundo es la acción que cambia
//el estado y crea un nuevo estado
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, productos: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, productos }, dispatch] = useReducer(
    logger(reducer),
    {
      productos: [],
      loading: true,
      error: '',
    }
  );
  //const [productos, setProductos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/productos');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }

      //setProductos(result.data);
    };
    fetchData();
  }, []);

  //Se le agrega un mensaje mientras carga y si hay un error lo muestra, si no muestra los productos.
  return (
    <div>
      <h1> Featured Products </h1>
      <div className="productos">
        
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          productos.map((producto) => (
            <div className="producto" key={producto.id}>
              <Link to={`/producto/${producto.id}`}>
                <img src={producto.imagen} alt={producto.denominacion} />
              </Link>
              <div className="producto-info">
                <Link to={`/producto/${producto.id}`}>
                  <p>{producto.denominacion}</p>
                </Link>
                <p>
                  <strong>{producto.precioVenta}</strong>
                </p>
                <button>Agregar al carrito</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
