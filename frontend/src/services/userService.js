import api from "../api/axios";

function authHeader() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
}

export const getUsers = async () => {
  const response = await api.get("/users", authHeader());
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`, authHeader());
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/users", data, authHeader());
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data, authHeader());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`, authHeader());
  return response.data;
};