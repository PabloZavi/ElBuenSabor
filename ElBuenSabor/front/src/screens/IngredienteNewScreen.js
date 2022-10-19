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

export default function IngredienteNewScreen() {
  const navigate = useNavigate();
  const [{ loadingUpload, loadingCreate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [nombreIngrediente, setNombreIngrediente] = useState('');
  const [stockMinimoIngrediente, setStockMinimoIngrediente] = useState();
  const [stockActualIngrediente, setStockActualIngrediente] = useState();
  const [unidadDeMedidaIngrediente, setUnidadDeMedidaIngrediente] =
    useState('');
  const [precioCostoIngrediente, setPrecioCostoIngrediente] = useState();
  const [altaIngrediente, setAltaIngrediente] = useState(true);
  const [rubroIngrediente, setRubroIngrediente] = useState('');
  const [rubros, setRubros] = useState([]);
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        Promise.all([getRubrosIngredientes(), getUnidadesIngredientes()]).then(
          function (results) {
            setRubros(results[0].data);
            setUnidades(results[1].data);
          }
        );
      } catch (err) {
        toast.error(getError(err));
      }
    };

    fetchData();

    localStorage.getItem('nombreIngrediente') &&
      setNombreIngrediente(localStorage.getItem('nombreIngrediente'));
    localStorage.getItem('stockMinimoIngrediente') &&
      setStockMinimoIngrediente(localStorage.getItem('stockMinimoIngrediente'));
    localStorage.getItem('stockActualIngrediente') &&
      setStockActualIngrediente(localStorage.getItem('stockActualIngrediente'));
    localStorage.getItem('unidadDeMedidaIngrediente') &&
      setUnidadDeMedidaIngrediente(
        localStorage.getItem('unidadDeMedidaIngrediente')
      );
    localStorage.getItem('precioCostoIngrediente') &&
      setPrecioCostoIngrediente(localStorage.getItem('precioCostoIngrediente'));
    localStorage.getItem('altaIngrediente') &&
      setAltaIngrediente(
        localStorage.getItem('altaIngrediente') === 'true' ? true : false
      );
    localStorage.getItem('rubroIngrediente') &&
      setRubroIngrediente(localStorage.getItem('rubroIngrediente'));
  }, []);

  function getRubrosIngredientes() {
    return axios.get(`/api/rubrosingredientes`);
  }

  function getUnidadesIngredientes() {
    return axios.get(`/api/unidades`);
  }

  function deleteLocalStorage() {
    let userInfo = localStorage.getItem('userInfo');
    localStorage.clear();
    localStorage.setItem('userInfo', userInfo);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        `/api/ingredientes`,
        {
          nombreIngrediente,
          stockMinimoIngrediente,
          stockActualIngrediente,
          unidadDeMedidaIngrediente,
          precioCostoIngrediente,
          altaIngrediente,
          rubroIngrediente,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Ingrediente creado!');
      deleteLocalStorage();
      navigate('/admin/ingredientes');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
      deleteLocalStorage();
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Crear ingrediente</title>
      </Helmet>
      <h1>Crear ingrediente </h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="nombreIngrediente">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={nombreIngrediente}
            onChange={(e) => {
              setNombreIngrediente(e.target.value);
              localStorage.setItem('nombreIngrediente', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="stockMinimoIngrediente">
          <Form.Label>Stock mínimo </Form.Label>
          <Form.Control
            type="Number"
            min="0"
            value={stockMinimoIngrediente}
            onChange={(e) => {
              setStockMinimoIngrediente(e.target.value);
              localStorage.setItem('stockMinimoIngrediente', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="stockActualIngrediente">
          <Form.Label>Stock actual </Form.Label>
          <Form.Control
            type="Number"
            min="0"
            value={stockActualIngrediente}
            onChange={(e) => {
              setStockActualIngrediente(e.target.value);
              localStorage.setItem('stockActualIngrediente', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="unidadDeMedidaIngrediente">
          <Row>
            <Col>
              <Select
                defaultValue={
                  unidadDeMedidaIngrediente
                    ? { label: unidadDeMedidaIngrediente }
                    : { label: 'Seleccionar unidad' }
                }
                options={unidades.map((unidad) => ({
                  label: unidad.nombreUnidad,
                  value: unidad.nombreUnidad,
                }))}
                onChange={(e) => {
                  setUnidadDeMedidaIngrediente(e.value);
                  localStorage.setItem('unidadDeMedidaIngrediente', e.value);
                }}
              ></Select>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3" controlId="rubroIngrediente">
          <Row>
            <Col>
              <Select
                defaultValue={
                  rubroIngrediente
                    ? { label: rubroIngrediente }
                    : { label: 'Seleccionar rubro' }
                }
                options={rubros.map((rubro) => ({
                  label: rubro.nombreRubro,
                  value: rubro.nombreRubro,
                }))}
                onChange={(e) => {
                  setRubroIngrediente(e.value);
                  localStorage.setItem('rubroIngrediente', e.value);
                }}
              ></Select>
            </Col>
            <Col>
              ¿No está el rubro? &rArr; &nbsp;
              <Button
                type="button"
                onClick={() => navigate(`/admin/rubroingrediente/new`)}
              >
                Crear rubro
              </Button>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3" controlId="precioCostoIngrediente">
          <Form.Label>Precio de costo</Form.Label>
          <Form.Control
            type="Number"
            min="0"
            value={precioCostoIngrediente}
            onChange={(e) => {
              setPrecioCostoIngrediente(e.target.value);
              localStorage.setItem('precioCostoIngrediente', e.target.value);
            }}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Check
          className="mb-3"
          type="checkbox"
          id="altaIngrediente"
          label="Está dado de alta?"
          checked={altaIngrediente}
          onChange={(e) => {
            setAltaIngrediente(e.target.checked);
            localStorage.setItem('altaIngrediente', e.target.checked);
          }}
        ></Form.Check>

        <div className="mb-3">
          <Button disabled={loadingCreate || loadingUpload} type="submit">
            Crear ingrediente
          </Button>
          {loadingCreate && <LoadingBox></LoadingBox>}{' '}
          <Button
            type="button"
            onClick={() => {
              deleteLocalStorage();
              navigate(`/admin/ingredientes`);
            }}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
