import { Router } from "express"
import { registro, login } from "../controllers/auth.controller.js"
import { validarRegistro, validarLogin } from "../middlewares/validacion.middleware.js"

const router = Router()

router.post("/registro", validarRegistro, registro)
router.post("/login", validarLogin, login)

export default router
