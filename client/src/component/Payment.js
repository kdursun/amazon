import React, { useContext, useEffect, useState } from 'react';
import CheckOutSteps from './CheckOutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../store';
import { useNavigate } from 'react-router-dom';

function Payment(props) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    card: { shippingAddress, paymentMethod },
  } = state;
  const [paymentMethodName, SetPaymentMethodName] = useState(
    paymentMethod || ''
  );
  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  const submitHandle = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'SAVE_PAYMENT', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };
  return (
    <div>
      <CheckOutSteps step1 step2 step3></CheckOutSteps>
      <Helmet>
        <title>Payment</title>
      </Helmet>
      <div className="container small-container">
        <h1 className="mb-3">Payment Methods</h1>
        <Form onSubmit={submitHandle}>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Paypal"
              label="Paypal"
              value="Paypal"
              checked={paymentMethodName === 'Paypal'}
              onChange={(e) => SetPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Other"
              label="Other"
              value="Other"
              checked={paymentMethodName === 'Other'}
              onChange={(e) => SetPaymentMethodName(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <Button type="submit" variant="primary">
              Kaydet
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Payment;
