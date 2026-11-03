import { Router } from "express"
import {
  crearReserva,
  getMisReservas,
  getReservas,
  cambiarEstado,
  cancelarReserva
} from "../controllers/reservasController.js"
import { verificarToken } from "../middlewares/auth.js"
import { esAdmin } from "../middlewares/esAdmin.js"
import { validarReserva, validarEstado, validarId } from "../middlewares/validacion.js"

const router = Router()

router.post("/", verificarToken, validarReserva, crearReserva)
router.get("/mis-reservas", verificarToken, getMisReservas)
router.get("/", verificarToken, esAdmin, getReservas)
router.put("/:id/estado", verificarToken, esAdmin, validarId, validarEstado, cambiarEstado)
router.delete("/:id", verificarToken, validarId, cancelarReserva)

export default router
