import { useEffect } from "react";
import { Stack } from "expo-router";
import { pedirPermisos } from "@/features/reservas/notificaciones";

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
      <Stack.Screen name="(auth)/login" options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="(auth)/registro" options={{ title: "Registrarse" }} />
      <Stack.Screen name="(app)/servicios/index" options={{ title: "Servicios" }} />
      <Stack.Screen name="(app)/servicios/crear" options={{ title: "Crear servicio" }} />
      <Stack.Screen name="(app)/servicios/[id]" options={{ title: "Detalle del servicio" }} />
      <Stack.Screen name="(app)/reservas/index" options={{ title: "Mis reservas" }} />
      <Stack.Screen name="(app)/reservas/nueva" options={{ title: "Nueva reserva" }} />
      <Stack.Screen name="(app)/reservas/admin" options={{ title: "Todas las reservas" }} />
      <Stack.Screen name="(app)/perfil" options={{ title: "Mi perfil" }} />
    </Stack>
  );
}
