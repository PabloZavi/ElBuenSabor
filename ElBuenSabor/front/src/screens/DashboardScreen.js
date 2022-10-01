import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Chart from 'react-google-charts';
import { Helmet } from 'react-helmet-async';

//Usaremos un reducer para traer la dashboard data desde el backend
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, summary: action.payload, loading: false }; //le asignamos a summary la data del back
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; //el error viene desde el back
    default:
      return state;
  }
};

export default function DashboardScreen() {
  //descontract variables of the state of this reducer
  //y el dispatch para disparar alguna de las opciones del reducer y actualizar su estado
  //pasamos como primer parámetro el reducer de arriba
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    //y como 2° parám un objeto c/loading en true xq lo primero será un ajax req en el loading de este componente
    //(en el useEffect)
    loading: true,
    error: '', //y el error vacío
  });

  //También necesitamos la userInfo
  const { state } = useContext(Store);
  const { userInfo } = state; //De acá sacamos el token para autenticar al usuario y mostrar la dashboard data

  useEffect(() => {
    //traemos la info del back
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        //llamamos a la acción 'FETCH_SUCCESS' y le pasamos la data (que se asignará a la variable summary del reducer)
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo.token]);

  return (
    <div>
      <Helmet>
        <title>Tablero</title>
      </Helmet>
      <h1>Tablero</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  {/* summary viene del back, extraemos el primer elemento de users y el numUsers de ese primer elemento */}
                  <Card.Title>
                    {/* Si existe summary.users y summary.users[0] mostrar la cantidad
                    si no mostrar 0 */}
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text>Usuarios</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text>Pedidos</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    ${' '}
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text>Total de ventas</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="my-3">
            <h2>Ventas</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>No hay ventas</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Cargando gráfico...</div>}
                data={[['Fecha', 'Ventas'],
              ...summary.dailyOrders.map((x)=>[x._id, x.sales])]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Rubros</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>No hay rubros</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Cargando gráfico...</div>}
                data={[['Rubros', 'Productos'],
              ...summary.productCategories.map((x)=>[x._id, x.count])]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}