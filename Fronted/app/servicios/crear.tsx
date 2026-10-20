import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { api } from "../../src/api";
import { decodificarToken, obtenerToken } from "../../src/auth";

export default function CrearServicio() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("");
  const [precio, setPrecio] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Esta pantalla solo es para admin
  useEffect(() => {
    const verificar = async () => {
      const token = await obtenerToken();
      if (!token) {
        router.replace("/login");
        return;
      }
      const payload = decodificarToken(token);
      if (payload?.rol !== "admin") {
        router.replace("/servicios");
      }
    };
    verificar();
  }, []);

  const handleCrear = async () => {
    setError("");
    if (!nombre || !descripcion || !duracion || !precio) {
      setError("Completa todos los campos");
      return;
    }
    if (isNaN(Number(duracion)) || isNaN(Number(precio))) {
      setError("Duración y precio deben ser números");
      return;
    }

    const token = await obtenerToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    setCargando(true);
    try {
      const res = await api.createServicio(
        token,
        nombre,
        descripcion,
        Number(duracion),
        Number(precio)
      );
      if ("error" in res) {
        setError(res.error);
      } else {
        Alert.alert("Listo", "Servicio creado");
        router.back();
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
    setCargando(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Nuevo servicio</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={[styles.input, { height: 90 }]}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Duración (minutos)"
          value={duracion}
          onChangeText={setDuracion}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.boton} onPress={handleCrear} disabled={cargando}>
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>Crear</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f3f4f6",
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
    textAlignVertical: "top",
  },
  error: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 8,
  },
  boton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
