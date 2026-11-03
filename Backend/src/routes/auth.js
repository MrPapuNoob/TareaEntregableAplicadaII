import { Router } from "express"
import { registro, login } from "../controllers/authController.js"
import { validarRegistro, validarLogin } from "../middlewares/validacion.js"

const router = Router()

router.post("/registro", validarRegistro, registro)
router.post("/login", validarLogin, login)

export default router
