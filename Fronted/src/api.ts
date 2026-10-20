import Constants from "expo-constants";
import { router } from "expo-router";
import { eliminarToken } from "./auth";

// La URL viene de app.config.js (extra.apiUrl), nunca hardcodeada
const API_URL: string = Constants.expoConfig?.extra?.apiUrl;

export type Servicio = {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
};

export type LoginResponse = {
  token?: string;
  error?: string;
};

export type RegistroResponse = {
  id?: number;
  nombre?: string;
  email?: string;
  rol?: string;
  error?: string;
};

// Si el token expiro o es invalido (401), se borra y se manda al login
const revisarRespuesta = async (res: Response) => {
  if (res.status === 401) {
    await eliminarToken();
    router.replace("/login");
  }
  return res.json();
};

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  registro: async (
    nombre: string,
    email: string,
    password: string,
    rol: string
  ): Promise<RegistroResponse> => {
    const res = await fetch(`${API_URL}/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, rol }),
    });
    return res.json();
  },

  getServicios: async (token: string): Promise<Servicio[] | { error: string }> => {
    const res = await fetch(`${API_URL}/servicios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },

  createServicio: async (
    token: string,
    nombre: string,
    descripcion: string,
    duracion: number,
    precio: number
  ): Promise<Servicio | { error: string }> => {
    const res = await fetch(`${API_URL}/servicios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, descripcion, duracion, precio }),
    });
    return revisarRespuesta(res);
  },

  updateServicio: async (
    token: string,
    id: number,
    nombre: string,
    descripcion: string,
    duracion: number,
    precio: number
  ): Promise<Servicio | { error: string }> => {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre, descripcion, duracion, precio }),
    });
    return revisarRespuesta(res);
  },

  deleteServicio: async (
    token: string,
    id: number
  ): Promise<{ message: string } | { error: string }> => {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },
};
