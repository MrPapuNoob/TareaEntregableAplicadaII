import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { api, Servicio } from "../../src/api";
import { obtenerToken } from "../../src/auth";

// Agrega un 0 adelante: 5 -> "05"
const dosDigitos = (n: number) => String(n).padStart(2, "0");

// Date -> "AAAA-MM-DD"
const formatearFecha = (d: Date) =>
  `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;

// Date -> "HH:MM"
const formatearHora = (d: Date) => `${dosDigitos(d.getHours())}:${dosDigitos(d.getMinutes())}`;

export default function NuevaReserva() {
  const { servicioId } = useLocalSearchParams<{ servicioId: string }>();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  // Una sola variable guarda la fecha y la hora elegidas
  const [fechaHora, setFechaHora] = useState(new Date());
  // Que selector se esta mostrando: "date", "time" o ninguno
  const [mostrar, setMostrar] = useState<"date" | "time" | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const token = await obtenerToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const data = await api.getServicio(token, Number(servicioId));
        if ("error" in data) {
          setError(data.error);
        } else {
          setServicio(data);
        }
      } catch {
        setError("No se pudo conectar con el servidor");
      }
      setCargando(false);
    };
    cargar();
  }, [servicioId]);

  const handleReservar = async () => {
    setError("");
    if (fechaHora < new Date()) {
      setError("No se puede reservar una fecha pasada");
      return;
    }
    const token = await obtenerToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    setGuardando(true);
    try {
      const res = await api.crearReserva(
        token,
        Number(servicioId),
        formatearFecha(fechaHora),
        formatearHora(fechaHora)
      );
      if ("error" in res) {
        setError(res.error);
      } else {
        Alert.alert("Listo", "Reserva creada");
        router.replace("/reservas");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setGuardando(false);
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Servicio</Text>
      <Text style={styles.servicio}>{servicio ? servicio.nombre : "-"}</Text>

      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setMostrar("date")}>
        <Text style={styles.selectorTexto}>{formatearFecha(fechaHora)}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Hora</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setMostrar("time")}>
        <Text style={styles.selectorTexto}>{formatearHora(fechaHora)}</Text>
      </TouchableOpacity>

      {mostrar && (
        <DateTimePicker
          value={fechaHora}
          mode={mostrar}
          is24Hour
          minimumDate={new Date()}
          onValueChange={(event, valor) => {
            setMostrar(null);
            setFechaHora(valor);
          }}
          onDismiss={() => setMostrar(null)}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.boton}
        onPress={handleReservar}
        disabled={guardando || !servicio}
      >
        {guardando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Confirmar reserva</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 24 },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 12,
  },
  servicio: { fontSize: 20, fontWeight: "bold", color: "#1e3a8a" },
  selector: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  selectorTexto: { fontSize: 16, color: "#111827" },
  error: { color: "#dc2626", textAlign: "center", marginTop: 12 },
  boton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  botonTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
