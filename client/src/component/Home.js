import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import reducerLogger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SubProduct from './SubProduct';
import { Helmet } from 'react-helmet-async';
import Loading from './Loading';
import MessageBox from './MessageBox';

const initialState = {
  loading: false,
  products: [],
  error: '',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { products: action.payload, loading: false, error: '' };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Home() {
  const [{ loading, products, error }, dispatch] = useReducer(
    reducerLogger(reducer),
    initialState
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/product');
        if (result) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (e) {
        dispatch({ type: 'FETCH_FAILURE', payload: e.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>amazona</title>
      </Helmet>
      <h1>Products</h1>
      <div className="products">
        {loading ? (
          <Loading />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((p) => (
              <Col key={p.slug} sm={6} md={4} lg={3} className="mb-3">
                <SubProduct p={p}></SubProduct>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Home;
