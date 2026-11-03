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
import { api, Servicio } from "@/services/api";
import { decodificarToken, eliminarToken, obtenerToken } from "@/lib/auth";
import ServicioCard from "@/features/servicios/ServicioCard";

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
        <TouchableOpacity
          style={styles.botonNav}
          onPress={() => router.push("/perfil")}
        >
          <Text style={styles.botonCrearTexto}>Mi perfil</Text>
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
            <ServicioCard
              servicio={item}
              onPress={() => router.push(`/servicios/${item.id}`)}
              onEliminar={rol === "admin" ? () => handleEliminar(item) : undefined}
            />
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
});
