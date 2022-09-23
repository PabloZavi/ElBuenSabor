import { useEffect, useReducer, useState } from 'react';

import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Producto from '../components/Producto';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
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
      <Helmet>
        <title>El Buen Sabor</title>
      </Helmet>
      <h1> ¡Nuestros Productos! </h1>
      <div className="productos">
        {loading ? (
          //<div>Cargando...</div>
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          //<div>{error}</div>
          <Row>
            {productos.map((producto) => (
              <Col key={producto._id} sm={6} md={4} lg={3} className="mb-3">
                <Producto producto={producto}></Producto>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
