import { createContext, useReducer } from 'react';

export const Store = createContext();

//Tenemos que definir reducer e initialState del useReducer para el StoreProvider
//Será un objeto. Su campo 'cart' tendrá otro object que su atributo será un array vacío de ítems
const initialState = {
  cart: {
    cartItems: [],
  },
};

//El reducer tiene que ser una función. Recibe un estado y una acción
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      return {
        ...state, //the object keep all the previous values in the field
        cart: {
          ...state.cart, //but for the cart object all the previous values in the cart object in the state
          //and only update cart items. Se mantienen los items anteriores (...state.cart.cartItems)
          //y agregamos el nuevo item ('action.payload')
          cartItems: [...state.cart.cartItems, action.payload],
        },
      };
    default:
      return state;
  }
}

//StoreProvider construye la vista pasando el Store, que extrae lo necesario del estado
//y despachará nuevas acciones. Pasa las propiedades globales to children
//Esta es una higher-order function que recibe "props"
export function StoreProvider(props) {
  //useReducer acepta dos parámetros, el reducer que tenemos que implementar y el default or initial state
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  //El {value} es el objeto definido arriba, que contiene el estado actual y el dispatch para actualizar el estado
  //se renderiza {props.children}
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

//Para usar StoreProvider, tenemos que poner a toda la app (index.js) dentro de <StoreProvider>