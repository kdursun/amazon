import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Star from './Star';
import axios from 'axios';
import { Store } from '../store';

function SubProduct({ p }) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    card: { cardItem },
  } = state;
  const addCardHandler = async (product) => {
    const existingItem = cardItem.find((x) => x._id === product._id);
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
  return (
    <Card>
      <Link to={`/product/${p.slug}`}>
        <img className="card-img-top" src={p.image} alt={p.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${p.slug}`}>
          <Card.Title>{p.name}</Card.Title>
        </Link>
        <Star rate={p.rating} gosterim={p.numReviews} />
        <Card.Text>{p.price}</Card.Text>
        {p.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button onClick={() => addCardHandler(p)}>Sepete Ekle</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default SubProduct;
