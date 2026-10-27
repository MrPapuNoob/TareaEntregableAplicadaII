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

export type Reserva = {
  id: number;
  fecha: string;
  hora: string;
  estado: string;
  usuarioId: number;
  servicioId: number;
  servicio?: Servicio;
  usuario?: { id: number; nombre: string; email: string };
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

  getServicio: async (token: string, id: number): Promise<Servicio | { error: string }> => {
    const res = await fetch(`${API_URL}/servicios/${id}`, {
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

  crearReserva: async (
    token: string,
    servicioId: number,
    fecha: string,
    hora: string
  ): Promise<Reserva | { error: string }> => {
    const res = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ servicioId, fecha, hora }),
    });
    return revisarRespuesta(res);
  },

  getMisReservas: async (token: string): Promise<Reserva[] | { error: string }> => {
    const res = await fetch(`${API_URL}/reservas/mis-reservas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },

  getReservas: async (token: string): Promise<Reserva[] | { error: string }> => {
    const res = await fetch(`${API_URL}/reservas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },

  cambiarEstado: async (
    token: string,
    id: number,
    estado: string
  ): Promise<Reserva | { error: string }> => {
    const res = await fetch(`${API_URL}/reservas/${id}/estado`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    });
    return revisarRespuesta(res);
  },

  cancelarReserva: async (token: string, id: number): Promise<Reserva | { error: string }> => {
    const res = await fetch(`${API_URL}/reservas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return revisarRespuesta(res);
  },
};
