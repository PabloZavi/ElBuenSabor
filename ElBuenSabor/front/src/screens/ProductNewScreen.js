import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
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

export default function ProductNewScreen() {
  const navigate = useNavigate();
  const [{ loadingUpload, loadingCreate }, dispatch] = useReducer(reducer, {
    //loading: true,
    //error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/productos`,
        {
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
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Producto creado!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
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
        <title>Crear producto</title>
      </Helmet>
      <h1>Crear producto </h1>

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
          <Form.Control type="file" onChange={uploadFileHandler}></Form.Control>
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
          <Button disabled={loadingCreate || loadingUpload} type="submit">
            Crear producto
          </Button>
          {loadingCreate && <LoadingBox></LoadingBox>}{' '}
          <Button type="button" onClick={() => navigate(`/admin/products`)}>
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
