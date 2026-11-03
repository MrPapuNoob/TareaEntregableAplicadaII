import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { api, Usuario } from "@/services/api";
import { eliminarToken, obtenerToken } from "@/lib/auth";

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState("");
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
        const data = await api.getPerfil(token);
        if ("error" in data) {
          setError(data.error);
        } else {
          setUsuario(data);
          setNombre(data.nombre);
        }
      } catch {
        setError("No se pudo conectar con el servidor");
      }
      setCargando(false);
    };
    cargar();
  }, []);

  const handleGuardar = async () => {
    setError("");
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    const token = await obtenerToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setGuardando(true);
    try {
      const data = await api.actualizarPerfil(token, nombre.trim());
      if ("error" in data) {
        setError(data.error);
      } else {
        setUsuario(data);
        setNombre(data.nombre);
        Alert.alert("Listo", "Nombre actualizado");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setGuardando(false);
  };

  // Borra el token de AsyncStorage y vuelve al login
  const handleLogout = async () => {
    await eliminarToken();
    router.replace("/login");
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
      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.valor}>{usuario?.nombre || "-"}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.valor}>{usuario?.email || "-"}</Text>
      </View>

      <Text style={styles.label}>Editar nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.boton} onPress={handleGuardar} disabled={guardando}>
        {guardando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Guardar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.boton, styles.botonSalir]} onPress={handleLogout}>
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
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
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 8,
  },
  valor: { fontSize: 18, fontWeight: "bold", color: "#1e3a8a" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  error: { color: "#dc2626", textAlign: "center", marginTop: 12 },
  boton: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  botonSalir: { backgroundColor: "#dc2626" },
  botonTexto: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
