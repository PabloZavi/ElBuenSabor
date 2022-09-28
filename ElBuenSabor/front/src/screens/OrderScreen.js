import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
//const mercadopago = require('mercadopago');
//import mercadopago from 'mercadopago';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    /* case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false }; */
    default:
      return state;
  }
};

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  //const [isPending, setIsPending] = useState(false);

  //El id viene de los parámetros
  const params = useParams();
  //el id lo sacamos de los parámetros y lo renombramos como 'orderId'
  const { id: orderId } = params;

  const valores = window.location.search;
  const urlParams = new URLSearchParams(valores);
  //let paid = urlParams.get('paid');
  

  const [paid, setPaid] = useState('')
  

  //const payment_id = urlParams.get('payment_id');

  //const { collection_status, payment_id } = params;
  //console.log(collection_status);
  //console.log(payment_id);

  const [totalPrice, setTotalPrice] = useState(0);
  //const [collection_status, setCollection_status] = useState(undefined);
  //setCollection_status(urlParams.get('collection_status'));
  //const [pagada, setPagada] = useState(false);

  /* if (collection_status !== undefined) {
    if (collection_status === 'approved') {
      onApprove();
      setCollection_status(undefined);
    }
  }

  async function onApprove(data, actions) {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      //console.log(userInfo.token);
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,{
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Order is paid');
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  } */

  const navigate = useNavigate();

  const [{ loading, error, order /* , successPay  */ }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      order: {},
      error: '',
      //successPay: false,
    }
  );

  const pagoMercadoPagoHandler = async (e) => {
    e.preventDefault();
    //dispatch({ type: 'PAY_REQUEST' });
    try {
      //Mando a pagoMercadoPagoRoutes el número de pedido y el total
      console.log(order.totalPrice);
      console.log(orderId);
      //guardo en 'data' la respuesta de MP
      const { data } = await axios.post('/pago', {
        orderId,
        totalPrice,
      });
      //data.message contiene la dirección!
      console.log(data.message);
      //order.isPaid = true;
      //Extraigo la dirección de MP para pagar y redirecciono
      //Abre en la misma ventana
      window.location.href = data.message;
      //Abre en otra
      //window.open (data.message);

      //console.log(dataMP);
      //dispatch({ type: 'PAY_SUCCESS', payload: data });
      //toast.success('Order is paid');
    } catch (error) {
      //dispatch({ type: 'PAY_FAIL', payload: getError(error) });
      toast.error(getError(error));
    }
  };

  /* const pagoMercadoPagoHandler = (e) => {
    e.preventDefault();
    // Crea un objeto de preferencia
    let preference = {
      items: [
        {
          title: orderId,
          unit_price: order.totalPrice.toFixed(2),
          quantity: 1,
        },
      ],
    };

    const responseMercadoPago = await mercadopago.preferences.create(preference);

     mercadopago.preferences
      .create(preference)
      .then(function (response) {
        const external_referenceMP = response.body.id;
      })
      .catch(function (error) {
        console.log(error);
      });  
  }; 


  const redirectToMercadoPago = (preferenceId) => {
    const loadScript = (url, callback) => {
      let script = document.createElement('script');
      script.type = 'text/javascript';
  
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (
            script.readyState === 'loaded' ||
            script.readyState === 'complete'
          ) {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = () => callback();
      }
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    };
  
    const handleScriptLoad = () => {
      const mp = new window.MercadoPago(process.env.REACT_APP_MERCADOPAGO_KEY, {
        locale: 'es-AR'
      });
      mp.checkout({
        preference: {
          id: preferenceId
        },
        autoOpen: true
      });
    };
  
    loadScript('https://sdk.mercadopago.com/js/v2', handleScriptLoad);
  }; */

  useEffect(() => {

    setPaid(urlParams.get('paid'))

    if (paid !== undefined) {
      if (paid === 'false' || paid === 'pending') {
        toast.error('Error en el pago');
        setPaid('')
      }
    }


    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }

    setTotalPrice(order.totalPrice);

    if (
      !order._id ||
      /* successPay || */ (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      /* if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      } */
    }
    //Si tenemos la orden ... obtenemos el token de MP y lo configuramos
    /* else {
      const loadMercadoPagoScript = async () => {
        const mercadopagotoken = await axios.get('/api/keys/mercadopago', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        mercadopago.configure({ access_token: mercadopagotoken });
      };
      loadMercadoPagoScript();
    } */
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paid, /* , collection_status, successPay */,
  ]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Pedido {orderId} </title>
      </Helmet>
      <h1 className="my-3">Pedido {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dirección de entrega</Card.Title>
              <Card.Text>
                <strong>Nombre: </strong> {order.shippingAddress.fullName}{' '}
                <br />
                <strong>Dirección: </strong> {order.shippingAddress.address},
                {order.shippingAddress.location}, {order.shippingAddress.phone}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Entregado {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">No entregado</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pago</Card.Title>
              <Card.Text>
                <strong>Método: </strong> {order.paymentMethod} <br />
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">Pagado {order.paidAt}</MessageBox>
              ) : (
                <MessageBox variant="danger">No pagado</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Productos</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.imagenProducto}
                          alt={item.nombreProducto}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/producto/${item._id}`}>
                          {item.nombreProducto}
                        </Link>
                      </Col>
                      <Col md={2}>
                        <span>{item.cantidad}</span>
                      </Col>
                      <Col md={2}>
                        <span>$ {item.precioVentaProducto}</span>
                      </Col>
                      <Col md={2}>
                        $ {item.cantidad * item.precioVentaProducto}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Resumen de pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Subtotal</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>IVA</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Descuento</Col>
                    <Col>${order.discount.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                {!order.isPaid && (
                  <ListGroup.Item>
                    {order.paymentMethod === 'MercadoPago' ? (
                      <Button onClick={pagoMercadoPagoHandler}>
                        Pagar con Mercado Pago
                      </Button>
                    ) : (
                      <div></div>
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
