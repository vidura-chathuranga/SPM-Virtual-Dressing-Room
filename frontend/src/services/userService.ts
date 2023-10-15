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
};

export default userService;
