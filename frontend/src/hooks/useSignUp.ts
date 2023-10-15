import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import axios from "axios";
import cartService from "../services/cartService";

export const useSignUp = () => {
  const [isLoading, setLoading] = useState(false);
  const { dispatch }: any = useAuthContext();

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    mobileNumber: string,
    shippingAddress: string,
    password: string
  ) => {
    setLoading(true);

    try {
      // send an reqeust to the login user, added proxy, then we dont want to add a BASE URL
      const response = await axios.post("http://localhost:3001/user/register", {
        firstName,
        lastName,
        mobileNumber,
        shippingAddress,
        email,
        password,
      });

      // save the user to the localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      await cartService.createCart(
        response.data._id,
        response.data.accessToken
      );

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

  return { signUp, isLoading };
};
