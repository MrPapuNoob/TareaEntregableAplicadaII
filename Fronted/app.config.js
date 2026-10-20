// La URL de la API se lee del archivo .env (API_URL=...)
// Expo carga el .env automaticamente antes de leer este archivo
export default {
  expo: {
    name: "Servicios App",
    slug: "servicios-app",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "serviciosapp",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff",
      },
      package: "com.davidbrito.serviciosapp",
    },
    web: {
      bundler: "metro",
    },
    plugins: ["expo-router", "expo-status-bar"],
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
