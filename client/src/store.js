import { createContext, useReducer } from 'react';

export const Store = createContext();
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  card: {
    cardItem: localStorage.getItem('cardItem')
      ? JSON.parse(localStorage.getItem('cardItem'))
      : [],
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},

    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
  },
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'Add_Card':
      const newItem = action.payload;
      const existItem = state.card.cardItem.find((x) => x._id === newItem._id);

      const tempCardItem1 = existItem
        ? state.card.cardItem.map((x) =>
            x._id === existItem._id ? newItem : x
          )
        : [...state.card.cardItem, newItem];

      localStorage.setItem('cardItem', JSON.stringify(tempCardItem1));
      return { ...state, card: { ...state.card, cardItem: tempCardItem1 } };
    case 'Remove_Item':
      const tempCardItem2 = state.card.cardItem.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cardItem', JSON.stringify(tempCardItem2));
      return { ...state, card: { ...state.card, cardItem: tempCardItem2 } };

    case 'CART_CLEAR':
      return { ...state, card: { ...state.card, cardItem: [] } };
    case 'SIGN_IN':
      return { ...state, userInfo: action.payload };
    case 'SIGN_OUT':
      return {
        ...state,
        userInfo: null,
        cart: { cardItem: [], shippingAddress: {}, paymentMethod: '' },
      };
    case 'SAVE_SHIPPING':
      return {
        ...state,
        card: { ...state.card, shippingAddress: action.payload },
      };
    case 'SAVE_PAYMENT':
      return {
        ...state,
        card: { ...state.card, paymentMethod: action.payload },
      };
    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
