import React, { useContext, useEffect, useReducer } from 'react';
import CheckOutSteps from './CheckOutSteps';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../store';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Loading from '../component/Loading';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'REQUEST_SUCCESS':
      return { ...state, loading: false };
    case 'REQUSET_FAILURE':
      return { ...state, loading: false };
    default:
      return { ...state };
  }
};

function PlaceOrder(props) {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { card, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  card.Itemsprice = round2(
    card.cardItem.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  card.shippingPrice = card.Itemsprice > 100 ? round2(0) : round2(10);
  card.taxPrice = round2(card.Itemsprice * 0.18);
  card.orderTotalPrice = card.Itemsprice + card.shippingPrice + card.taxPrice;

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/order',
        {
          orderItems: card.cardItem,
          shippingAddress: card.shippingAddress,
          paymentMethod: card.paymentMethod,
          itemsPrice: card.Itemsprice,
          shippingPrice: card.shippingPrice,
          taxPrice: card.taxPrice,
          totalPrice: card.orderTotalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'REQUEST_SUCCESS' });
      localStorage.removeItem('cardItem');
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'REQUSET_FAILURE' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!card.paymentMethod) {
      navigate('/payment');
    }
  }, [card, navigate]);
  return (
    <div>
      <CheckOutSteps step1 step2 step3 step4></CheckOutSteps>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1 className="mb-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {card.shippingAddress.fullName}
                <br />
                <strong>Address: </strong>
                {card.shippingAddress.address},{card.shippingAddress.city},
                {card.shippingAddress.postalCode},{card.shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Payment Method: </strong>
                {card.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title> Card Items</Card.Title>
              <ListGroup variant="flush">
                {card.cardItem.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>
                        <span>{item.price}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/card">Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>{card.Itemsprice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>{card.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>{card.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>{card.orderTotalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={handleClick}
                      disabled={card.cardItem.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <Loading></Loading>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrder;
