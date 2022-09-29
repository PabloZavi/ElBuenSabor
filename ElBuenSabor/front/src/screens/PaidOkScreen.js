import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

export default function PaidOkScreen() {
    const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  const valores = window.location.search;
  const urlParams = new URLSearchParams(valores);

  const payment_id = urlParams.get('payment_id');
  const external_reference = urlParams.get('external_reference');

  async function actPedido() {
    try {
      await axios.put(
        `/api/orders/${external_reference}/pay`,
        {
          payment_id,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
    } catch (error) {
      toast.error(getError(error));
    }
  }

  actPedido();
  //Usar navigate, NO window.location.href, si no se pierde el localStorage 
  //window.location.href = `/order/${external_reference}`;
  navigate(`/order/${external_reference}`);
}
