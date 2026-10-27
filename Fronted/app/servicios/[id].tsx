import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api, Servicio } from "../../src/api";
import { obtenerToken } from "../../src/auth";

export default function DetalleServicio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      const token = await obtenerToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const data = await api.getServicio(token, Number(id));
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
  }, [id]);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (error || !servicio) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{error || "Servicio no encontrado"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.nombre}>{servicio.nombre}</Text>
        <Text style={styles.descripcion}>{servicio.descripcion}</Text>
        <View style={styles.divisor} />
        <Text style={styles.detalle}>Duración: {servicio.duracion} min</Text>
        <Text style={styles.precio}>${servicio.precio}</Text>
      </View>

      <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push(`/reservas/nueva?servicioId=${servicio.id}`)}
      >
        <Text style={styles.botonTexto}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", padding: 16 },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 24,
  },
  error: { color: "#dc2626", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 1,
  },
  nombre: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  descripcion: { fontSize: 15, color: "#6b7280", marginTop: 8 },
  divisor: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 12 },
  detalle: { fontSize: 15, color: "#374151" },
  precio: { fontSize: 20, fontWeight: "bold", color: "#059669", marginTop: 4 },
  boton: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  botonTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
