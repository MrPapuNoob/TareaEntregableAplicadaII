import { Router } from "express"
import {
  getServicios,
  getServicio,
  createServicio,
  updateServicio,
  deleteServicio
} from "../controllers/serviciosController.js"
import { verificarToken } from "../middlewares/auth.js"
import { esAdmin } from "../middlewares/esAdmin.js"
import { validarServicio, validarId } from "../middlewares/validacion.js"

const router = Router()

router.get("/", verificarToken, getServicios)
router.get("/:id", verificarToken, validarId, getServicio)
router.post("/", verificarToken, esAdmin, validarServicio, createServicio)
router.put("/:id", verificarToken, esAdmin, validarId, validarServicio, updateServicio)
router.delete("/:id", verificarToken, esAdmin, validarId, deleteServicio)

export default router
