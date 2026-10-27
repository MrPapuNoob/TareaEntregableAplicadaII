import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { api, Reserva } from "../../src/api";
import { decodificarToken, obtenerToken } from "../../src/auth";

// Color segun el estado de la reserva
const colorEstado = (estado: string) => {
  if (estado === "completada") return { color: "#065f46", backgroundColor: "#d1fae5" };
  if (estado === "cancelada") return { color: "#991b1b", backgroundColor: "#fee2e2" };
  return { color: "#92400e", backgroundColor: "#fef3c7" };
};

export default function AdminReservas() {
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
    // Esta pantalla solo es para admin
    const payload = decodificarToken(token);
    if (payload?.rol !== "admin") {
      router.replace("/servicios");
      return;
    }
    try {
      const data = await api.getReservas(token);
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

  useEffect(() => {
    cargar();
  }, []);

  const handleEstado = async (reserva: Reserva, estado: string) => {
    const token = await obtenerToken();
    if (!token) return;
    try {
      const res = await api.cambiarEstado(token, reserva.id, estado);
      if ("error" in res) {
        Alert.alert("Error", res.error);
      } else {
        cargar();
      }
    } catch {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.vacio}>No hay reservas</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.servicio}>
                {item.servicio?.nombre || `Servicio #${item.servicioId}`}
              </Text>
              <Text style={styles.usuario}>
                Cliente: {item.usuario?.nombre} ({item.usuario?.email})
              </Text>
              <Text style={styles.fecha}>
                {item.fecha} a las {item.hora}
              </Text>
              <Text style={[styles.badge, colorEstado(item.estado)]}>{item.estado}</Text>
              {item.estado === "pendiente" && (
                <View style={styles.botones}>
                  <TouchableOpacity
                    style={[styles.boton, styles.botonCompletar]}
                    onPress={() => handleEstado(item, "completada")}
                  >
                    <Text style={styles.botonTexto}>Completar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.boton, styles.botonCancelar]}
                    onPress={() => handleEstado(item, "cancelada")}
                  >
                    <Text style={styles.botonTexto}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
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
  servicio: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  usuario: { fontSize: 14, color: "#374151", marginTop: 4 },
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
  botones: { flexDirection: "row", gap: 8, marginTop: 12 },
  boton: { flex: 1, padding: 10, borderRadius: 6, alignItems: "center" },
  botonCompletar: { backgroundColor: "#059669" },
  botonCancelar: { backgroundColor: "#dc2626" },
  botonTexto: { color: "#fff", fontWeight: "bold" },
});
