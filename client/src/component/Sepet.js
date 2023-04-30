import React, { useContext } from 'react';
import { Store } from '../store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from './MessageBox';
import { Helmet } from 'react-helmet-async';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function Sepet(props) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    card: { cardItem },
  } = state;

  const UpdateCardHandler = async (product, quantity) => {
    const { data } = await axios.get(`/api/product/id/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'Add_Card',
      payload: { ...product, quantity: quantity },
    });
  };

  const RemoveCardHandler = (product) => {
    ctxDispatch({ type: 'Remove_Item', payload: product });
  };

  const odemeyeGec = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Sepetim</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cardItem.length === 0 ? (
            <MessageBox>
              Sepet boş <Link to="/">Alışverişe Başla</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cardItem.map((s) => (
                <ListGroup.Item key={s._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={s.image}
                        alt={s.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${s.slug}`}>{s.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        disabled={s.quantity === 1}
                        onClick={() => UpdateCardHandler(s, s.quantity - 1)}
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{s.quantity}</span>{' '}
                      <Button
                        onClick={() => UpdateCardHandler(s, s.quantity + 1)}
                        variant="light"
                        disabled={s.quantity === s.countInStock}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>{s.price} TL</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => RemoveCardHandler(s)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Toplam:{cardItem.reduce((a, c) => a + c.quantity, 0)} Adet{' '}
                    <br></br>
                    Fiyat:
                    {cardItem.reduce((a, c) => a + c.price * c.quantity, 0)} TL
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      onClick={odemeyeGec}
                      type="button"
                      variant="primary"
                      disabled={cardItem.length === 0}
                    >
                      Ödemeye Geç
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Sepet;
