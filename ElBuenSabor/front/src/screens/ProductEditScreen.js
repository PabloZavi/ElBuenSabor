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
import Select from 'react-select';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
  const [tiempoCocinaProducto, setTiempoCocinaProducto] = useState();
  const [recetaProducto, setRecetaProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [imagenProducto, setImagenProducto] = useState('');
  const [precioVentaProducto, setPrecioVentaProducto] = useState();
  const [altaProducto, setAltaProducto] = useState(false);
  const [rubroProducto, setRubroProducto] = useState('');
  const [stockProducto, setStockProducto] = useState();
  const [isCeliaco, setIsCeliaco] = useState(false);
  const [isVegetariano, setIsVegetariano] = useState(false);
  const [rubros, setRubros] = useState([]);

  //PRIMERA ACLARACIÓN
  //¿Por qué se usa una lógica diferente a newProduct?
  //Al actualizar un producto, traemos de la base de datos todos los datos del producto, pero, al igual
  //que en newProduct, podemos querer agregar un rubro que falte y después volver a la pantalla de edición
  //del producto, sin que se vuelvan a cargar los datos de la base de datos si actualizamos algún campo
  //(si no la información del campo que actualizamos sería reemplazada por la que está en la DB, y NO queremos esto
  //después de actualizar un campo, sólo lo queremos la primera vez que cargamos la pantalla para editar )
  //Entonces al cargar la pantalla, comprobamos primero si existe en localStorage el campo, si no existe, significa que...
  //Se está cargando por primera vez la pantalla de edición del producto
  //Entonces acá sí le ponemos la información de la DB, pero no directamente al campo (mediante setNombreCampo), sino
  //lo guardamos en una variable en localStorage
  //Y después de todo esto, seteamos todas las variables con la info del localStorage
  //Si existe el campo en el localStorage, significa que...
  //Hemos vuelto a la pantalla de edición (después de agregar un rubro por ejemplo),
  //entonces NO se vuelve a traer la información de la DB, y usa toda la info del localStorage
  //(se haya modificado esa info o no, pero evitamos que si modificamos algo, se sobreescriba con lo de la DB)

  //SEGUNDA ACLARACIÓN
  //Se usa la palabra "Edit" después de cada campo del localStorage en esta pantalla de edición
  //para diferenciarlos de los campos de newProduct, por si quedan en el localStorage, para evitar que se mezclen

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        //Cada vez que se carga la pantalla, trae la info de la DB
        const { data } = await axios.get(`/api/productos/${productId}`);

        //Si no existe cada variable en el localStorage...
        //Se setean las variables del localStorage con la info de la DB
        //Si ya existen, no se hace nada
        !localStorage.getItem('nombreProductoEdit') &&
          localStorage.setItem('nombreProductoEdit', data.nombreProducto);

        !localStorage.getItem('tiempoCocinaProductoEdit') &&
          localStorage.setItem(
            'tiempoCocinaProductoEdit',
            data.tiempoCocinaProducto
          );

        !localStorage.getItem('recetaProductoEdit') &&
          localStorage.setItem('recetaProductoEdit', data.recetaProducto);

        !localStorage.getItem('descripcionProductoEdit') &&
          localStorage.setItem('descripcionProductoEdit', data.descripcionProducto);

        !localStorage.getItem('imagenProductoEdit') &&
          localStorage.setItem('imagenProductoEdit', data.imagenProducto);

        !localStorage.getItem('precioVentaProductoEdit') &&
          localStorage.setItem('precioVentaProductoEdit', data.precioVentaProducto);

        !localStorage.getItem('rubroProductoEdit') &&
          localStorage.setItem('rubroProductoEdit', data.rubroProducto);

        !localStorage.getItem('stockProductoEdit') &&
          localStorage.setItem('stockProductoEdit', data.stockProducto);

        !localStorage.getItem('altaProductoEdit') &&
          localStorage.setItem('altaProductoEdit', data.altaProducto);

        !localStorage.getItem('isCeliacoEdit') &&
          localStorage.setItem('isCeliacoEdit', data.isCeliaco);

        !localStorage.getItem('isVegetarianoEdit') &&
          localStorage.setItem('isVegetarianoEdit', data.isVegetariano);

        //Y acá seteamos las variables de la pantalla con la info del localStorage
        //cada vez que se carga la página
        localStorage.getItem('nombreProductoEdit') &&
          setNombreProducto(localStorage.getItem('nombreProductoEdit'));
        localStorage.getItem('tiempoCocinaProductoEdit') &&
          setTiempoCocinaProducto(localStorage.getItem('tiempoCocinaProductoEdit'));
        localStorage.getItem('recetaProductoEdit') &&
          setRecetaProducto(localStorage.getItem('recetaProductoEdit'));
        localStorage.getItem('descripcionProductoEdit') &&
          setDescripcionProducto(localStorage.getItem('descripcionProductoEdit'));
        localStorage.getItem('imagenProductoEdit') &&
          setImagenProducto(localStorage.getItem('imagenProductoEdit'));
        localStorage.getItem('precioVentaProductoEdit') &&
          setPrecioVentaProducto(localStorage.getItem('precioVentaProductoEdit'));
        localStorage.getItem('altaProductoEdit') &&
          setAltaProducto(
            localStorage.getItem('altaProductoEdit') === 'true' ? true : false
          );
        localStorage.getItem('isVegetarianoEdit') &&
          setIsVegetariano(
            localStorage.getItem('isVegetarianoEdit') === 'true' ? true : false
          );
        localStorage.getItem('isCeliacoEdit') &&
          setIsCeliaco(
            localStorage.getItem('isCeliacoEdit') === 'true' ? true : false
          );
        localStorage.getItem('rubroProductoEdit') &&
          setRubroProducto(localStorage.getItem('rubroProductoEdit'));
        localStorage.getItem('stockProductoEdit') &&
          setStockProducto(localStorage.getItem('stockProductoEdit'));

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
  }, []);

  function deleteLocalStorage() {
    let userInfo = localStorage.getItem('userInfo');
    localStorage.clear();
    localStorage.setItem('userInfo', userInfo);
  }

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
      deleteLocalStorage();
      navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
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
              onChange={(e) => {
                setNombreProducto(e.target.value);
                localStorage.setItem('nombreProductoEdit', e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcionProducto">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              value={descripcionProducto}
              onChange={(e) => {
                setDescripcionProducto(e.target.value);
                localStorage.setItem('descripcionProductoEdit', e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="recetaProducto">
            <Form.Label>Receta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={recetaProducto}
              onChange={(e) => {
                setRecetaProducto(e.target.value);
                localStorage.setItem('recetaProductoEdit', e.target.value);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="tiempoCocinaProducto">
            <Form.Label>Tiempo de cocina</Form.Label>
            <Form.Control
              type="Number"
              min="0"
              value={tiempoCocinaProducto}
              onChange={(e) => {
                setTiempoCocinaProducto(e.target.value);
                localStorage.setItem('tiempoCocinaProductoEdit', e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          
          <Form.Group className="mb-3" controlId="rubroProducto">
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
                    localStorage.setItem('rubroProductoEdit', e.value);
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
            {/* <Form.Label>Rubro</Form.Label>
            <Form.Control
              value={rubroProducto}
              onChange={(e) => setRubroProducto(e.target.value)}
              required
            ></Form.Control> */}
          </Form.Group>


          <Form.Group className="mb-3" controlId="imagenProducto">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              value={imagenProducto}
              onChange={(e) => {
                setImagenProducto(e.target.value);
                localStorage.setItem('imagenProductoEdit', e.target.value);
              }}
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
              min="0"
              type="Number"
              value={precioVentaProducto}
              onChange={(e) => {
                setPrecioVentaProducto(e.target.value);
                localStorage.setItem('precioVentaProductoEdit', e.target.value);
              }}
              required
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
              localStorage.setItem('altaProductoEdit', e.target.checked);
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
              localStorage.setItem('isVegetarianoEdit', e.target.checked);
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
              localStorage.setItem('isCeliacoEdit', e.target.checked);
            }}
          ></Form.Check>

          <Form.Group className="mb-3" controlId="stockProducto">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              min="0"
              type="Number"
              value={stockProducto}
              onChange={(e) => {
                setStockProducto(e.target.value);
                localStorage.setItem('stockProductoEdit', e.target.value);
              }}
              required
            ></Form.Control>
          </Form.Group>

          <div className="mb-3">
            <Button disabled={loadingUpdate || loadingUpload} type="submit">
              Actualizar
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}{' '}
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
      )}
    </Container>
  );
}
