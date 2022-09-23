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
      //Guardamos en una constante el ítem que vamos a agregar al carrito como nuevo ítem
      const newItem = action.payload;
      //Comprobamos si ya existe en el carrito el ítem o no
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem //Si existe el ítem en el carrito...
        ? state.cart.cartItems.map(
            (
              item //Actualizamos el ítem "nuevo" con el ítem que ya existía en el carrito
            ) => (item._id === existItem._id ? newItem : item)
          )
        : [...state.cart.cartItems, newItem]; //Si no le agregamos el nuevo ítem al carrito
      return { ...state, cart: { ...state.cart, cartItems } }; //y actualizamos el carrito basado en la const 'cartItems'
    /* return {
        ...state, //the object keep all the previous values in the field
        cart: {
          ...state.cart, //but for the cart object all the previous values in the cart object in the state
          //and only update cart items. Se mantienen los items anteriores (...state.cart.cartItems)
          //y agregamos el nuevo item ('action.payload')
          cartItems: [...state.cart.cartItems, action.payload],
        },
      }; */
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
