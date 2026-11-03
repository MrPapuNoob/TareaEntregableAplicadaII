import { Router } from "express"
import { getPerfil, actualizarPerfil } from "../controllers/usuariosController.js"
import { verificarToken } from "../middlewares/auth.js"
import { validarPerfil } from "../middlewares/validacion.js"

const router = Router()

router.get("/perfil", verificarToken, getPerfil)
router.put("/perfil", verificarToken, validarPerfil, actualizarPerfil)

export default router
