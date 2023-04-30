import React, { useEffect, useReducer, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import reducerLogger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Star from './Star';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import MessageBox from './MessageBox';
import { getError } from '../utils';
import { Store } from '../store';

const initialState = {
  loading: false,
  product: [],
  error: '',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { product: action.payload, loading: false, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Product() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [{ loading, product, error }, dispatch] = useReducer(
    reducerLogger(reducer),
    initialState
  );
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/product/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (e) {
        dispatch({ type: 'FETCH_FAILURE', payload: getError(e) });
      }
    };
    fetchData();
  }, [slug]);

  //CartItem Part
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { card } = state;

  const addCartHandler = async () => {
    const existingItem = card.cardItem.find((x) => x._id === product._id);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/product/id/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'Add_Card',
      payload: { ...product, quantity: quantity },
    });
    navigate('/card');
  };

  return loading ? (
    <div>Loading</div>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Row>
      <Col key={product.slug} md={6}>
        <img src={product.image} alt={product.name} className="img-large"></img>
      </Col>
      <Col md={3}>
        <ListGroup variant="flush">
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <ListGroup.Item>{product.name}</ListGroup.Item>
          <ListGroup.Item>
            <Star rate={product.rating} gosterim={product.numReviews} />
          </ListGroup.Item>
          <ListGroup.Item>{product.price} TL</ListGroup.Item>
          <ListGroup.Item>{product.description}</ListGroup.Item>
        </ListGroup>
      </Col>

      <Col md={3}>
        <Card>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>{product.price} TL</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Satus:</Col>
                  <Col>
                    {product.countInStock > 0 ? (
                      <Badge bg="success">in Stock</Badge>
                    ) : (
                      <Badge bg="danger">No Stock</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {product.countInStock > 0 && (
                  <Button className="btn btn-primary" onClick={addCartHandler}>
                    Add Card
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Product;
