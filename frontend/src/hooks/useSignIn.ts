import { useContext, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import cartService from "../services/cartService";
import { CartContext } from "../contexts/CartContext";

export const useSignIn = () => {
  const [isLoading, setLoading] = useState(false);
  const { dispatch }: any = useAuthContext();
  const { dispatch: dispatchCart }: any = useContext(CartContext);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    try {
      // send an reqeust to the login user, added proxy, then we dont want to add a BASE URL
      const response = await axios.post("http://localhost:3001/user/login", {
        email,
        password,
      });

      // save the user to the localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      // get the cart of the user
      let cart = await cartService.getCartByUserId(
        response.data._id,
        response.data.accessToken
      );
      if (!cart) {
        cart = await cartService.createCart(
          response.data._id,
          response.data.accessToken
        );
      }
      cart.items.forEach((item: any) => {
        dispatchCart({
          type: "ADD_TO_CART",
          payload: item,
        });
      });

      // update the auth context
      dispatch({ type: "LOGIN", payload: response.data });
    } catch (error: any) {
      // set loading false
      setLoading(false);
      // set error message
      return error.response.data.error;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, isLoading };
};
