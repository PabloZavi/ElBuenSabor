import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import { Store } from '../Store';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [nombreUsuario, setNombreUsuario] = useState(userInfo.nombreUsuario);
  const [emailUsuario, setEmailUsuario] = useState(userInfo.emailUsuario);
  const [passwordUsuario, setPasswordUsuario] = useState('');
  const [confirmPasswordUsuario, setConfirmPasswordUsuario] = useState('');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    if (passwordUsuario !== confirmPasswordUsuario) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          nombreUsuario,
          emailUsuario,
          passwordUsuario,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(error));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>Perfil de usuario </title>
      </Helmet>
      <h1 className="my-3">Perfil de usuario</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="nombreUsuario">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="emailUsuario">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={emailUsuario}
            onChange={(e) => setEmailUsuario(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="passwordUsuario">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPasswordUsuario(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPasswordUsuario">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPasswordUsuario(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit">Actualizar</Button>
      </form>
    </div>
  );
}
