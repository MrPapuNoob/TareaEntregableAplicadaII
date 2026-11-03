import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Servicio } from "@/services/api";

type Props = {
  servicio: Servicio;
  onPress: () => void;
  // Solo se pasa si el usuario es admin
  onEliminar?: () => void;
};

export default function ServicioCard({ servicio, onPress, onEliminar }: Props) {
  return (
    <View style={styles.card}>
      {/* Al tocar el servicio se abre su detalle */}
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <Text style={styles.nombre}>{servicio.nombre}</Text>
        <Text style={styles.descripcion}>{servicio.descripcion}</Text>
        <Text style={styles.detalle}>Duración: {servicio.duracion} min</Text>
        <Text style={styles.precio}>${servicio.precio}</Text>
      </TouchableOpacity>
      {onEliminar && (
        <TouchableOpacity style={styles.botonEliminar} onPress={onEliminar}>
          <Text style={styles.botonEliminarTexto}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
