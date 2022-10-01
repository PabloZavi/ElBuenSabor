import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const params = useParams();
  const { id: productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [nombreProducto, setNombreProducto] = useState('');
  const [tiempoCocinaProducto, setTiempoCocinaProducto] = useState(0);
  const [recetaProducto, setRecetaProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [imagenProducto, setImagenProducto] = useState('');
  const [precioVentaProducto, setPrecioVentaProducto] = useState('');
  const [altaProducto, setAltaProducto] = useState(false);
  const [rubroProducto, setRubroProducto] = useState('');
  const [stockProducto, setStockProducto] = useState(0);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/productos/${productId}`);
        setNombreProducto(data.nombreProducto);
        setTiempoCocinaProducto(data.tiempoCocinaProducto);
        setRecetaProducto(data.recetaProducto);
        setDescripcionProducto(data.descripcionProducto);
        setImagenProducto(data.imagenProducto);
        setPrecioVentaProducto(data.precioVentaProducto);
        setAltaProducto(data.altaProducto);
        setRubroProducto(data.rubroProducto);
        setStockProducto(data.stockProducto);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Editar producto {productId}</title>
      </Helmet>
      <h1>Editar producto {productId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form>
          <Form.Group className="mb-3" controlId="nombreProducto">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="tiempoCocinaProducto">
            <Form.Label>Tiempo de cocina</Form.Label>
            <Form.Control
              value={tiempoCocinaProducto}
              onChange={(e) => setTiempoCocinaProducto(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="recetaProducto">
            <Form.Label>Receta</Form.Label>
            <Form.Control
              value={recetaProducto}
              onChange={(e) => setRecetaProducto(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              value={descripcionProducto}
              onChange={(e) => setDescripcionProducto(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="imagenProducto">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              value={imagenProducto}
              onChange={(e) => setImagenProducto(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="precioVentaProducto">
            <Form.Label>Precio de venta</Form.Label>
            <Form.Control
              value={precioVentaProducto}
              onChange={(e) => setPrecioVentaProducto(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="altaProducto">
            <Form.Label>Alta?</Form.Label>
            <Form.Control
              value={altaProducto}
              onChange={(e) => setAltaProducto(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="rubroProducto">
            <Form.Label>Rubro</Form.Label>
            <Form.Control
              value={rubroProducto}
              onChange={(e) => setRubroProducto(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="stockProducto">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              value={stockProducto}
              onChange={(e) => setStockProducto(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Actualizar</Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
