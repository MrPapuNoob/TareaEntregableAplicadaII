import { useEffect } from "react";
import { Stack } from "expo-router";
import { pedirPermisos } from "../src/notificaciones";

export default function RootLayout() {
  // Se piden los permisos de notificacion al iniciar la app
  useEffect(() => {
    pedirPermisos();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e3a8a" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="registro" options={{ title: "Registrarse" }} />
      <Stack.Screen name="servicios/index" options={{ title: "Servicios" }} />
      <Stack.Screen name="servicios/crear" options={{ title: "Crear servicio" }} />
      <Stack.Screen name="servicios/[id]" options={{ title: "Detalle del servicio" }} />
      <Stack.Screen name="reservas/index" options={{ title: "Mis reservas" }} />
      <Stack.Screen name="reservas/nueva" options={{ title: "Nueva reserva" }} />
      <Stack.Screen name="reservas/admin" options={{ title: "Todas las reservas" }} />
      <Stack.Screen name="perfil" options={{ title: "Mi perfil" }} />
    </Stack>
  );
}
