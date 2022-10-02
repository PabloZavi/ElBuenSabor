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
        productos: action.payload.productos,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

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

//Explicación extra:
//después de haber creado el método deleteHandler...
//1. Le agregamos 'successDelete' a los casos del reducer
//2. Le agregamos 'successDelete' al reducer (function 'ProductListScreen')
//3. Lo pasamos como dependencia en el array en el useEffect, para que...
//Cuando se actualiza el valor de la variable 'successDelete', se corre de nuevo el useEffect
//Entonces si eliminamos un producto, false a true, se renderiza la pantalla
//y con el if en el useEffect que comprueba si es verdadero el successDelete (después de renderizar la pantalla)
//lo pasa a false llamando a 'DELETE_RESET', si es false el successDelete, llama a fetchData y trae de nuevo
//los datos de la base de datos
//Entonces el camino es:
//1. Se ejecuta el useEffect cuando se renderiza la pantalla, trae los productos de la DB y los muestra.
//   Por defecto successDelete es false, entonces no se vuelve a renderizar al menos que pase a true
//2. Cuando se aprieta el botón 'delete producto', se llama a DeleteHandler, lo elimina de la base de datos
//   y llama a 'DELETE_SUCCESS', que cambia el estado 'successDelete' a true, por ende, se ejecuta de nuevo
//   el useEffect, trae los datos actualizados de la DB y los muestra (ya sin el producto eliminado)
//3. Y después de hacer eso, comprueba el valor de successDelete (está en true todavía) y llamando a
//   'DELETE_RESET' lo pasa a false y listo.

export default function ProductListScreen() {
  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      productos,
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
        const { data } = await axios.get(`/api/productos/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo.token, successDelete]);

  const createHandler = async () => {
    if (window.confirm('Está seguro de crear un nuevo producto?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/productos',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Producto creado!');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.producto._id}`);
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteHandler = async (producto) => {
    if (window.confirm('Está seguro de elmininar?')) {
      try {
        await axios.delete(`/api/productos/${producto._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Producto eliminado');
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
        <title>Lista de productos</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Productos</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Crear producto
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
                <th>Precio</th>
                <th>Rubro</th>
                <th>Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td>{producto._id}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>$ {producto.precioVentaProducto}</td>
                  <td>{producto.rubroProducto}</td>
                  <td>{producto.altaProducto.toString()}</td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/product/${producto._id}`)}
                    >
                      Editar
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(producto)}
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
                to={`/admin/products?page=${x + 1}`}
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
