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
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return {
        ...state,
        loadingUpload: true,
        errorUpload: '',
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };
    default:
      return state;
  }
};

export default function ProductEditScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  //Si no está en el reducer no se puede usar abajo
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
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
  const [isCeliaco, setIsCeliaco] = useState(false);
  const [isVegetariano, setIsVegetariano] = useState(false);

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
        setIsCeliaco(data.isCeliaco);
        setIsVegetariano(data.isVegetariano);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/productos/${productId}`,
        {
          _id: productId,
          nombreProducto,
          tiempoCocinaProducto,
          recetaProducto,
          descripcionProducto,
          imagenProducto,
          precioVentaProducto,
          altaProducto,
          rubroProducto,
          stockProducto,
          isCeliaco,
          isVegetariano,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Producto actualizado!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      toast.success('Imagen subida correctamente!');
      setImagenProducto(data.secure_url);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL' });
    }
  };

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
        <Form onSubmit={submitHandler}>
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

          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Subir imagen</Form.Label>
            <Form.Control
              type="file"
              onChange={uploadFileHandler}
            ></Form.Control>
            {loadingUpload && <LoadingBox></LoadingBox>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="precioVentaProducto">
            <Form.Label>Precio de venta</Form.Label>
            <Form.Control
              value={precioVentaProducto}
              onChange={(e) => setPrecioVentaProducto(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="altaProducto"
            label="Está dado de alta?"
            checked={altaProducto}
            onChange={(e) => setAltaProducto(e.target.checked)}
          ></Form.Check>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isVegetariano"
            label="Vegetariano?"
            checked={isVegetariano}
            onChange={(e) => setIsVegetariano(e.target.checked)}
          ></Form.Check>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isCeliaco"
            label="Apto celíacos?"
            checked={isCeliaco}
            onChange={(e) => setIsCeliaco(e.target.checked)}
          ></Form.Check>

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
            <Button disabled={loadingUpdate} type="submit">
              Actualizar
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}{' '}
            <Button type="button" onClick={() => navigate(`/admin/products`)}>
              Cancelar
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
}
