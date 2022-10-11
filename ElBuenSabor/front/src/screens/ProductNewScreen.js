import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const reducer = (state, action) => {
  switch (action.type) {
    /* case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        rubros: action.payload.rubros,
        
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; */

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
    loading: true,
    error: '',
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
  /* const [rubroProducto, setRubroProducto] = useState(null); */
  const [stockProducto, setStockProducto] = useState(0);
  const [isCeliaco, setIsCeliaco] = useState(false);
  const [isVegetariano, setIsVegetariano] = useState(false);
  const [rubros, setRubros] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get(`/api/rubros`);
        //datos = JSON.parse(datos);
        //console.log(data);
        setRubros(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchData();

    localStorage.getItem('nombreProducto') &&
      setNombreProducto(localStorage.getItem('nombreProducto'));
    localStorage.getItem('tiempoCocinaProducto') &&
      setTiempoCocinaProducto(localStorage.getItem('tiempoCocinaProducto'));
    localStorage.getItem('recetaProducto') &&
      setRecetaProducto(localStorage.getItem('recetaProducto'));
    localStorage.getItem('descripcionProducto') &&
      setDescripcionProducto(localStorage.getItem('descripcionProducto'));
    localStorage.getItem('imagenProducto') &&
      setImagenProducto(localStorage.getItem('imagenProducto'));
    localStorage.getItem('precioVentaProducto') &&
      setPrecioVentaProducto(localStorage.getItem('precioVentaProducto'));
    localStorage.getItem('altaProducto') &&
      setAltaProducto(
        localStorage.getItem('altaProducto') === 'true' ? true : false
      );
    localStorage.getItem('isVegetariano') &&
      setIsVegetariano(
        localStorage.getItem('isVegetariano') === 'true' ? true : false
      );
    localStorage.getItem('isCeliaco') &&
      setIsCeliaco(localStorage.getItem('isCeliaco') === 'true' ? true : false);
    localStorage.getItem('rubroProducto') &&
      setRubroProducto(localStorage.getItem('rubroProducto'));
    localStorage.getItem('stockProducto') &&
      setStockProducto(localStorage.getItem('stockProducto'));
  }, []);

  function deleteLocalStorage() {
    let userInfo = localStorage.getItem('userInfo');
    /* localStorage.removeItem('nombreProducto')
    localStorage.removeItem('tiempoCocinaProducto') 
    localStorage.removeItem('recetaProducto')
    localStorage.removeItem('descripcionProducto')
    localStorage.removeItem('imagenProducto')
    localStorage.removeItem('precioVentaProducto')
    localStorage.removeItem('altaProducto')
    localStorage.removeItem('isVegetariano') 
    localStorage.removeItem('isCeliaco')
    localStorage.removeItem('rubroProducto')
    localStorage.removeItem('stockProducto') */
    localStorage.clear();
    localStorage.setItem('userInfo', userInfo);
  }

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
      deleteLocalStorage();
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
      deleteLocalStorage();
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
            onChange={(e) => {
              setNombreProducto(e.target.value);
              localStorage.setItem('nombreProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="tiempoCocinaProducto">
          <Form.Label>Tiempo de cocina</Form.Label>
          <Form.Control
            value={tiempoCocinaProducto}
            onChange={(e) => {
              setTiempoCocinaProducto(e.target.value);
              localStorage.setItem('tiempoCocinaProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="recetaProducto">
          <Form.Label>Receta</Form.Label>
          <Form.Control
            value={recetaProducto}
            onChange={(e) => {
              setRecetaProducto(e.target.value);
              localStorage.setItem('recetaProducto', e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="descripcionProducto">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            value={descripcionProducto}
            onChange={(e) => {
              setDescripcionProducto(e.target.value);
              localStorage.setItem('descripcionProducto', e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="imagenProducto">
          <Form.Label>Imagen</Form.Label>
          <Form.Control
            value={imagenProducto}
            onChange={(e) => {
              setImagenProducto(e.target.value);
              localStorage.setItem('imagenProducto', e.target.value);
            }}
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
            onChange={(e) => {
              setPrecioVentaProducto(e.target.value);
              localStorage.setItem('precioVentaProducto', e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="altaProducto"
          label="Está dado de alta?"
          checked={altaProducto}
          onChange={(e) => {
            setAltaProducto(e.target.checked);
            localStorage.setItem('altaProducto', e.target.checked);
          }}
        ></Form.Check>

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="isVegetariano"
          label="Vegetariano?"
          checked={isVegetariano}
          onChange={(e) => {
            setIsVegetariano(e.target.checked);
            localStorage.setItem('isVegetariano', e.target.checked);
          }}
        ></Form.Check>

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="isCeliaco"
          label="Apto celíacos?"
          checked={isCeliaco}
          onChange={(e) => {
            setIsCeliaco(e.target.checked);
            localStorage.setItem('isCeliaco', e.target.checked);
          }}
        ></Form.Check>

        <Form.Group className="mb-3" controlId="rubroProducto">
          {/* <Form.Label>Rubro</Form.Label> */}
          {/* <Form.Control
            value={rubroProducto}
            onChange={(e) => setRubroProducto(e.target.value)}
            required
          ></Form.Control> */}
          {/* <Form.Select>
            {rubros.map((rubro) => (
              <option key={rubro._id} value={rubro.nombreRubro}>{rubro.nombreRubro}</option>
            ))}

            
          </Form.Select> */}

          <Row>
            <Col>
              <Select
                defaultValue={
                  rubroProducto
                    ? { label: rubroProducto }
                    : { label: 'Seleccionar rubro' }
                }
                options={rubros.map((rubro) => ({
                  label: rubro.nombreRubro,
                  value: rubro.nombreRubro,
                }))}
                onChange={(e) => {
                  setRubroProducto(e.value);
                  localStorage.setItem('rubroProducto', e.value);
                }}
              ></Select>
            </Col>
            <Col>
              ¿No está el rubro? --- &nbsp;
              <Button
                type="button"
                onClick={() => navigate(`/admin/rubro/new`)}
              >
                Crear rubro
              </Button>
            </Col>
          </Row>
        </Form.Group>

        {/* <Form.Group className="mb-3" controlId="rubroProducto">
          <Form.Label>Rubro</Form.Label>
           

          <Combobox
            data={rubros}
            dataKey="_id"
            textField="nombreRubro"
            placeholder="Seleccionar rubro"
          ></Combobox>
        </Form.Group> */}

        {/* {rubros.map((rubro) => (
                <tr key={rubro._id}>
                  <td>{rubro._id}</td>
                  <td>{rubro.nombreRubro}</td>
                  <td>{rubro.altaRubro.toString()}</td>
                  
                </tr>
              ))} */}

        <Form.Group className="mb-3" controlId="stockProducto">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            value={stockProducto}
            onChange={(e) => {
              setStockProducto(e.target.value);
              localStorage.setItem('stockProducto', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <div className="mb-3">
          <Button disabled={loadingCreate || loadingUpload} type="submit">
            Crear producto
          </Button>
          {loadingCreate && <LoadingBox></LoadingBox>}{' '}
          <Button
            type="button"
            onClick={() => {
              deleteLocalStorage();
              navigate(`/admin/products`);
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
