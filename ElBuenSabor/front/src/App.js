import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import NavBar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import PaidOkScreen from './screens/PaidOkScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductNewScreen from './screens/ProductNewScreen';
import RubroListScreen from './screens/RubroListScreen';
import RubroNewScreen from './screens/RubroNewScreen';
import RubroEditScreen from './screens/RubroEditScreen';
import RubroIngredienteListScreen from './screens/RubroIngredienteListScreen';
import RubroIngredienteNewScreen from './screens/RubroIngredienteNewScreen';
import RubroIngredienteEditScreen from './screens/RubroIngredienteEditScreen';
import IngredienteListScreen from './screens/IngredienteListScreen';
import IngredienteEditScreen from './screens/IngredienteEditScreen';
import IngredienteNewScreen from './screens/IngredienteNewScreen';

function App() {
  //Traemos el estado de la app desde el store
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //De la info traída del store, traemos el estado de cart y de userInfo
  const { cart, userInfo } = state;

  //Signout de un usuario. Limpiamos el Store y también el de navegador
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    //localStorage.removeItem('userInfo');
    //localStorage.removeItem('shippingAddress');
    //localStorage.removeItem('paymentMethod');
    //localStorage.removeItem('cartItems');
    localStorage.clear();
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/productos/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="top-center" limit={1}></ToastContainer>
        <header>
          <NavBar bg="dark" variant="dark" expand="lg" /*  fixed="top" */>
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="bi bi-layout-sidebar-inset"></i>
              </Button>

              <LinkContainer to="/">
                <NavBar.Brand>El Buen Sabor</NavBar.Brand>
              </LinkContainer>
              <NavBar.Toggle aria-controls="basic-navbar-nav"></NavBar.Toggle>
              <NavBar.Collapse id="basic-navbar-nav">
                <SearchBox></SearchBox>
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Carrito
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.cantidad, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={userInfo.nombreUsuario}
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Perfil</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>
                          Historial de pedidos
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider></NavDropdown.Divider>
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Desconectarse
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In{' '}
                    </Link>
                  )}
                  {/* Ojo acá el condicional que verifica si isAdmin para mostrar la sección Admin */}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Administrador" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Tablero</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Productos</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/admin/ingredientes">
                        <NavDropdown.Item>Ingredientes</NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown drop="end" id="nav-dropdown2" title="Rubros">
                        <NavDropdown.Item href="/admin/rubros">
                          Productos
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/admin/rubrosingredientes">
                          Ingredientes
                        </NavDropdown.Item>
                      </NavDropdown>

                      {/* <LinkContainer to="/admin/rubros">
                        <NavDropdown.Item>Rubros</NavDropdown.Item>
                      </LinkContainer> */}

                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Pedidos</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Usuarios</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </NavBar.Collapse>
            </Container>
          </NavBar>
          {/* <Link to="/">El Buen Sabor</Link> */}
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categorías</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/producto/:_id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              {/* Usamos el componente ProtectedRoute para las rutas protegidas */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/paidok" element={<PaidOkScreen />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />

              {/* Admin routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen></DashboardScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen></ProductListScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen></OrderListScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen></UserListScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/product/new"
                element={
                  <AdminRoute>
                    <ProductNewScreen></ProductNewScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen></ProductEditScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/ingredientes"
                element={
                  <AdminRoute>
                    <IngredienteListScreen></IngredienteListScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/ingrediente/new"
                element={
                  <AdminRoute>
                    <IngredienteNewScreen></IngredienteNewScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/ingrediente/:id"
                element={
                  <AdminRoute>
                    <IngredienteEditScreen></IngredienteEditScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen></UserEditScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/rubros"
                element={
                  <AdminRoute>
                    <RubroListScreen></RubroListScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/rubro/new"
                element={
                  <AdminRoute>
                    <RubroNewScreen></RubroNewScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/rubro/:id"
                element={
                  <AdminRoute>
                    <RubroEditScreen></RubroEditScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/rubrosingredientes"
                element={
                  <AdminRoute>
                    <RubroIngredienteListScreen></RubroIngredienteListScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/rubroingrediente/new"
                element={
                  <AdminRoute>
                    <RubroIngredienteNewScreen></RubroIngredienteNewScreen>
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/rubroingrediente/:id"
                element={
                  <AdminRoute>
                    <RubroIngredienteEditScreen></RubroIngredienteEditScreen>
                  </AdminRoute>
                }
              ></Route>
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
