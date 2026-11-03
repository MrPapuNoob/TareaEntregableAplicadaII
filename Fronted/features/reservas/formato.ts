// Agrega un 0 adelante: 5 -> "05"
const dosDigitos = (n: number) => String(n).padStart(2, "0");

// Date -> "AAAA-MM-DD"
export const formatearFecha = (d: Date) =>
  `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;

// Date -> "HH:MM"
export const formatearHora = (d: Date) => `${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;

// Color segun el estado de la reserva
export const colorEstado = (estado: string) => {
  if (estado === "completada") return { color: "#065f46", backgroundColor: "#d1fae5" };
  if (estado === "cancelada") return { color: "#991b1b", backgroundColor: "#fee2e2" };
  return { color: "#92400e", backgroundColor: "#fef3c7" };
};
