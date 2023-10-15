import { createContext, useReducer, ReactNode, useEffect } from "react";

// Define the shape of your cart item
export interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
}

// Define the shape of your cart state
interface CartState {
  cart: CartItem[];
}

interface CartContextProviderProps {
  children: ReactNode;
}

// Create a new type that includes both CartState and dispatch function
interface CartContextValue extends CartState {
  dispatch: React.Dispatch<any>;
}

// Create the cart context
export const CartContext = createContext<CartContextValue>({
  cart: [],
  dispatch: () => null,
});

// Define your cart reducer function
export const cartReducer = (state: CartState, action: any) => {
  switch (action.type) {
    case "ADD_TO_CART":
      // Implement logic to add an item to the cart
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "REMOVE_FROM_CART":
      // Implement logic to remove an item from the cart
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      // Implement logic to update an item's quantity in the cart
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    default:
      return state;
  }
};

export const CartContextProvider: React.FC<CartContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: [],
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    dispatch({ type: "SET_CART", payload: savedCart });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
