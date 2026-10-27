import { Router } from "express"
import {
  crearReserva,
  getMisReservas,
  getReservas,
  cambiarEstado,
  cancelarReserva
} from "../controllers/reservas.controller.js"
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js"
import { validarReserva, validarEstado, validarId } from "../middlewares/validacion.middleware.js"

const router = Router()

router.post("/", verificarToken, validarReserva, crearReserva)
router.get("/mis-reservas", verificarToken, getMisReservas)
router.get("/", verificarToken, soloAdmin, getReservas)
router.put("/:id/estado", verificarToken, soloAdmin, validarId, validarEstado, cambiarEstado)
router.delete("/:id", verificarToken, validarId, cancelarReserva)

export default router
