import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        ingredientes: action.payload.ingredientes,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function IngredienteListScreen() {
  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      ingredientes,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/ingredientes/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const deleteHandler = async (ingrediente) => {
    if (window.confirm('Está seguro de elmininar?')) {
      try {
        await axios.delete(`/api/ingredientes/${ingrediente._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Ingrediente eliminado');
        dispatch({
          type: 'DELETE_SUCCESS',
        });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Helmet>
        <title>Lista de ingredientes</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Ingredientes</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button
              type="button"
              onClick={() => navigate(`/admin/ingrediente/new`)}
            >
              Crear ingrediente
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio de Costo</th>
                <th>Stock Mínimo</th>
                <th>Stock Actual</th>
                <th>Rubro</th>
                <th>Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((ingrediente) => (
                <tr key={ingrediente._id}>
                  <td>{ingrediente._id}</td>
                  <td>{ingrediente.nombreIngrediente}</td>
                  <td>$ {ingrediente.precioCostoIngrediente}</td>
                  <td>{ingrediente.stockMinimoIngrediente}</td>
                  <td>{ingrediente.stockActualIngrediente}</td>
                  
                  <td>{ingrediente.rubroIngrediente}</td>
                  <td>
                    {ingrediente.altaIngrediente ? 'Sí' : <p className="red">No</p>}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/ingrediente/${ingrediente._id}`)}
                    >
                      Editar
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(ingrediente)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/ingredientes?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
