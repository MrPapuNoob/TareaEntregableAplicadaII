// shortcut: se importa desde build/ porque el index de expo-notifications carga el módulo de push
// (ExpoTopicSubscriptionModule) que Expo Go en Android no trae y la app se cae.
// Con un development build se puede volver a `import * as Notifications from 'expo-notifications'`.
import { setNotificationHandler } from "expo-notifications/build/NotificationsHandler";
import { requestPermissionsAsync } from "expo-notifications/build/NotificationPermissions";
import { scheduleNotificationAsync } from "expo-notifications/build/scheduleNotificationAsync";
import { cancelScheduledNotificationAsync } from "expo-notifications/build/cancelScheduledNotificationAsync";
import { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reserva } from "./api";

const UN_DIA_MS = 24 * 60 * 60 * 1000;

// Se guarda que notificacion corresponde a cada reserva para poder cancelarla
const claveNotificacion = (reservaId: number) => `notificacion_reserva_${reservaId}`;

// Sin este handler las notificaciones no se muestran mientras la app está abierta
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Se llama al iniciar la app (en _layout.tsx)
export const pedirPermisos = async () => {
  try {
    const { granted, canAskAgain } = await requestPermissionsAsync();
    if (!granted) {
      console.warn(
        `Permiso de notificaciones denegado${canAskAgain ? "" : " (actívalo en Ajustes > Apps > Expo Go > Notificaciones)"}`
      );
    }
    return granted;
  } catch (err) {
    console.warn("No se pudieron pedir permisos de notificación:", err);
    return false;
  }
};

// Recordatorio 24 horas antes de la reserva
export const programarRecordatorio = async (reserva: Reserva, nombreServicio: string) => {
  try {
    const fechaReserva = new Date(`${reserva.fecha}T${reserva.hora}:00`);
    const fechaAviso = new Date(fechaReserva.getTime() - UN_DIA_MS);

    // Si la reserva es en menos de 24 horas, no se programa
    if (fechaAviso <= new Date()) return;

    if (!(await pedirPermisos())) return;

    const notificacionId = await scheduleNotificationAsync({
      content: {
        title: "Recordatorio de reserva",
        body: `Mañana tienes tu reserva de ${nombreServicio} a las ${reserva.hora}`,
      },
      trigger: { type: SchedulableTriggerInputTypes.DATE, date: fechaAviso },
    });
    await AsyncStorage.setItem(claveNotificacion(reserva.id), notificacionId);
  } catch (err) {
    // Una falla de notificaciones (ej. en web) no debe afectar la reserva
    console.warn("No se pudo programar la notificación:", err);
  }
};

// Al cancelar la reserva se cancela su recordatorio (si tenia uno)
export const cancelarRecordatorio = async (reservaId: number) => {
  try {
    const notificacionId = await AsyncStorage.getItem(claveNotificacion(reservaId));
    if (!notificacionId) return;
    await cancelScheduledNotificationAsync(notificacionId);
    await AsyncStorage.removeItem(claveNotificacion(reservaId));
  } catch (err) {
    console.warn("No se pudo cancelar la notificación:", err);
  }
};
