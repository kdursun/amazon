import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './component/Home';
import Product from './component/Product';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import { Store } from './store';
import { useContext, useState, useEffect } from 'react';
import Sepet from './component/Sepet';
import Signin from './component/Signin';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ShippingAdress from './component/ShippingAdress';
import Signup from './component/Signup';
import Payment from './component/Payment';
import PlaceOrder from './component/PlaceOrder';
import Order from './component/Order';
import OrderHistory from './component/OrderHistory';
import Profile from './component/Profile';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getError } from './utils';
import SearchBox from './component/SearchBox';
import Search from './component/Search';
import ProtectedRoute from './component/ProtectedRoute';
import AdminRoute from './component/AdminRoute';
import DashboardScreen from './component/Admin/DashboardScreen';
//import OrderListScreen from './component/Admin/OrderListScreen';
import ProductListScreen from './component/Admin/ProductListScreen';
import UserEditScreen from './component/Admin/UserEditScreen';
import ProductEditScreen from './component/Admin/ProductEditScreen';
import UserListScreen from './component/Admin/UserListScreen';
import OrderListScreen from './component/Admin/OrderListScreen';
import ResetPasswordScreen from './component/ResetPassword';
import ForgetPasswordScreen from './component/ForgetPassword';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { card, userInfo } = state;
  const signoutHandler = () => {
    ctxDispatch({ type: 'SIGN_OUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/product/categories`);
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
          sidebarOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="top-right" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/card" className="nav-link">
                    Sepet
                    {card.cardItem.length > 0 && (
                      <Badge pill bg="danger">
                        {card.cardItem.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link to="/signin" className="nav-link">
                      Signin
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Kategoriler</strong>
            </Nav.Item>
            {categories.map((c) => (
              <Nav.Item key={c}>
                <LinkContainer
                  to={{ pathname: '/search', search: `category=${c}` }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Nav.Link>{c}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        <main>
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/product/:slug" element={<Product />}></Route>
              <Route path="/card" element={<Sepet />}></Route>
              <Route path="/signin" element={<Signin />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/payment" element={<Payment />}></Route>
              <Route path="/placeorder" element={<PlaceOrder />}></Route>
              <Route path="/search" element={<Search />}></Route>

              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <Order />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderHistory"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <ShippingAdress />
                  </ProtectedRoute>
                }
              ></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center">Copyright 2023</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
