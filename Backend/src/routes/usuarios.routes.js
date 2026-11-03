import { Router } from "express"
import { getPerfil, actualizarPerfil } from "../controllers/usuarios.controller.js"
import { verificarToken } from "../middlewares/auth.middleware.js"
import { validarPerfil } from "../middlewares/validacion.middleware.js"

const router = Router()

router.get("/perfil", verificarToken, getPerfil)
router.put("/perfil", verificarToken, validarPerfil, actualizarPerfil)

export default router
