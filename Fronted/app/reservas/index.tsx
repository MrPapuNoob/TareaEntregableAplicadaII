import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { api, Reserva } from "../../src/api";
import { obtenerToken } from "../../src/auth";

// Color segun el estado de la reserva
const colorEstado = (estado: string) => {
  if (estado === "completada") return { color: "#065f46", backgroundColor: "#d1fae5" };
  if (estado === "cancelada") return { color: "#991b1b", backgroundColor: "#fee2e2" };
  return { color: "#92400e", backgroundColor: "#fef3c7" };
};

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = async () => {
    setCargando(true);
    setError("");
    const token = await obtenerToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    try {
      const data = await api.getMisReservas(token);
      if (Array.isArray(data)) {
        setReservas(data);
      } else {
        setError(data.error || "No se pudieron cargar las reservas");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const handleCancelar = (reserva: Reserva) => {
    Alert.alert("Confirmar", "¿Cancelar esta reserva?", [
      { text: "No", style: "cancel" },
      {
        text: "Sí, cancelar",
        style: "destructive",
        onPress: async () => {
          const token = await obtenerToken();
          if (!token) return;
          try {
            const res = await api.cancelarReserva(token, reserva.id);
            if ("error" in res) {
              Alert.alert("Error", res.error);
            } else {
              cargar();
            }
          } catch {
            Alert.alert("Error", "No se pudo conectar con el servidor");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.vacio}>No tienes reservas</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.servicio}>
                {item.servicio?.nombre || `Servicio #${item.servicioId}`}
              </Text>
              <Text style={styles.fecha}>Fecha: {item.fecha}</Text>
              <Text style={styles.fecha}>Hora: {item.hora}</Text>
              <Text style={[styles.badge, colorEstado(item.estado)]}>{item.estado}</Text>
              {item.estado === "pendiente" && (
                <TouchableOpacity
                  style={styles.botonCancelar}
                  onPress={() => handleCancelar(item)}
                >
                  <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  error: { color: "#dc2626", textAlign: "center", marginTop: 16 },
  vacio: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  servicio: { fontSize: 16, fontWeight: "bold", color: "#111827", marginBottom: 6 },
  fecha: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  badge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  botonCancelar: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 12,
  },
  botonCancelarTexto: { color: "#fff", fontWeight: "bold" },
});
