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
import { api, Servicio } from "../../src/api";
import { decodificarToken, eliminarToken, obtenerToken } from "../../src/auth";

export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [rol, setRol] = useState("");
  const [email, setEmail] = useState("");

  const cargar = async () => {
    setCargando(true);
    setError("");
    const token = await obtenerToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const payload = decodificarToken(token);
    if (payload) {
      setRol(payload.rol);
      setEmail(payload.email);
    }
    try {
      const data = await api.getServicios(token);
      if (Array.isArray(data)) {
        setServicios(data);
      } else {
        setError(data.error || "No se pudieron cargar los servicios");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  // Se recarga cada vez que se vuelve a esta pantalla (ej: despues de crear)
  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const handleLogout = async () => {
    await eliminarToken();
    router.replace("/login");
  };

  const handleEliminar = (servicio: Servicio) => {
    Alert.alert("Confirmar", `¿Eliminar "${servicio.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const token = await obtenerToken();
          if (!token) return;
          try {
            const res = await api.deleteServicio(token, servicio.id);
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
      <View style={styles.header}>
        <View>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.rol}>Rol: {rol}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.botones}>
        <TouchableOpacity
          style={styles.botonNav}
          onPress={() => router.push("/reservas")}
        >
          <Text style={styles.botonCrearTexto}>Mis reservas</Text>
        </TouchableOpacity>
        {rol === "admin" && (
          <>
            <TouchableOpacity
              style={styles.botonCrear}
              onPress={() => router.push("/servicios/crear")}
            >
              <Text style={styles.botonCrearTexto}>+ Crear servicio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botonNav, styles.botonAdmin]}
              onPress={() => router.push("/reservas/admin")}
            >
              <Text style={styles.botonCrearTexto}>Todas las reservas</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {cargando ? (
        <ActivityIndicator size="large" color="#1e3a8a" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={servicios}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vacio}>No hay servicios registrados</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Al tocar el servicio se abre su detalle */}
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => router.push(`/servicios/${item.id}`)}
              >
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                <Text style={styles.detalle}>Duración: {item.duracion} min</Text>
                <Text style={styles.precio}>${item.precio}</Text>
              </TouchableOpacity>
              {rol === "admin" && (
                <TouchableOpacity
                  style={styles.botonEliminar}
                  onPress={() => handleEliminar(item)}
                >
                  <Text style={styles.botonEliminarTexto}>Eliminar</Text>
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
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  email: { fontSize: 14, color: "#374151", fontWeight: "500" },
  rol: { fontSize: 12, color: "#6b7280" },
  logout: { color: "#dc2626", fontWeight: "bold" },
  botones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  botonCrear: {
    backgroundColor: "#059669",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  botonNav: {
    backgroundColor: "#1e3a8a",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  botonAdmin: { backgroundColor: "#7c3aed" },
  botonCrearTexto: { color: "#fff", fontWeight: "bold" },
  error: { color: "#dc2626", textAlign: "center", marginTop: 16 },
  vacio: { textAlign: "center", color: "#6b7280", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    gap: 8,
  },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  descripcion: { fontSize: 14, color: "#6b7280", marginTop: 2 },
  detalle: { fontSize: 14, color: "#374151", marginTop: 6 },
  precio: { fontSize: 16, fontWeight: "bold", color: "#059669", marginTop: 2 },
  botonEliminar: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  botonEliminarTexto: { color: "#fff", fontWeight: "bold", fontSize: 13 },
});
