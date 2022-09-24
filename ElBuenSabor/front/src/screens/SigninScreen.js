import { Link, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

export default function SigninScreen() {
    //useLocation es un hook de react, y usaremos la información del objeto 'search'...
  const { search } = useLocation();
  //Instanciamos URLSearchParams, le pasamos el objeto 'search' y obtenemos el redirect del cuerpo
  //Si viene del carrito de compras, entonces el valor será /shipping
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  //Comprobamos que exista y lo seteamos en la variable redirect, si no le seteamos '/'
  const redirect = redirectInUrl ? redirectInUrl : '/';

  return (
    <Container className="small-container">
      <Helmet>
        <title>Acceso</title>
      </Helmet>
      <h1 className="my-3">Acceso</h1>
      <Form>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" required></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" required></Form.Control>
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Ingresa</Button>
        </div>
        <div className="mb-3">
          ¿Nuevo usuario?{' '}
          {/* Se dirigirá al usuario a la pantalla de Sign Up y después a la dirección
          definida por la variable 'redirect' que dependerá de en dónde estemos. Esto se define
          con la lógica de arriba antes del return */}
          <Link to={`/signup?redirect=${redirect}`}>Crea tu cuenta</Link>
        </div>
      </Form>
    </Container>
  );
}
