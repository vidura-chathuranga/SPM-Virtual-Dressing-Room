import axios from "axios";

const baseUrl = "http://localhost:3001/user";

const userService = {
  getUserById: async (id: string, token: string) => {
    const response = await axios.get(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  updateUser: async (id: string, token: string, user: any) => {
    const response = await axios.put(`${baseUrl}/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  changePassword: async (
    id: string,
    token: string,
    currentPassword: string,
    newPassword: string
  ) => {
    const payload = {
      currentPassword,
      newPassword,
    };
    const response = await axios.put(`${baseUrl}/${id}/password`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  getPaymentInfoByUserId: (id: string, token: string) => {
    return axios.get(`${baseUrl}/${id}/paymentInfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updatePaymentInfo: (id: string, token: string, info: string) => {
    return axios.patch(
      `${baseUrl}/${id}/paymentInfo`,
      { info: info },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  getPaymentTokenByUserId: (id: string, token: string) => {
    return axios.get(`${baseUrl}/${id}/payment/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  processPayment: (order: any, nonce: string, token: string) => {
    return axios.post(
      `${baseUrl}/${order.user}/payment`,
      { order: order, nonce: nonce },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};

export default userService;
