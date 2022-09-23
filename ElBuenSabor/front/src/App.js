import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext } from 'react';
import { Store } from './Store';

function App() {
  const { state} = useContext(Store);
  const {cart} = state;
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <NavBar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <NavBar.Brand>El Buen Sabor</NavBar.Brand>
              </LinkContainer>
              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                Carrito
                {cart.cartItems.length>0&&(
                  <Badge pill bg="danger">
                    {cart.cartItems.length}
                  </Badge>
                )}
                </Link>
              </Nav>
            </Container>
          </NavBar>
          {/* <Link to="/">El Buen Sabor</Link> */}
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/producto/:id" element={<ProductScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center"> El Buen Sabor Footer</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
