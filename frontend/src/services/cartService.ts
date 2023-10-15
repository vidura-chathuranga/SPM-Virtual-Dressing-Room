import axios from "axios";

const baseUrl = "http://localhost:3001/cart";

const cartService = {
  createCart: async (userId: string, token: string) => {
    const response = await axios.post(
      baseUrl,
      {
        user: userId,
        items: [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
  getCartByUserId: async (id: string, token: string) => {
    const response = await axios.get(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  updateCart: async (id: string, token: string, cart: any) => {
    const response = await axios.put(`${baseUrl}/${id}`, cart, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default cartService;
