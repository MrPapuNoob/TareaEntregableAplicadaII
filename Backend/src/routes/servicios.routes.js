import { Router } from "express"
import {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio
} from "../controllers/servicios.controller.js"
import { verificarToken, soloAdmin } from "../middlewares/auth.middleware.js"
import { validarServicio, validarId } from "../middlewares/validacion.middleware.js"

const router = Router()

router.get("/", verificarToken, getServicios)
router.post("/", verificarToken, soloAdmin, validarServicio, createServicio)
router.put("/:id", verificarToken, soloAdmin, validarId, validarServicio, updateServicio)
router.delete("/:id", verificarToken, soloAdmin, validarId, deleteServicio)

export default router
