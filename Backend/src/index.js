import "dotenv/config"
import express from "express"
import { logger } from "./middlewares/logger.js"
import authRoutes from "./routes/auth.js"
import serviciosRoutes from "./routes/servicios.js"
import reservasRoutes from "./routes/reservas.js"
import usuariosRoutes from "./routes/usuarios.js"

const app = express()
app.use(logger)
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "API de servicios funcionando" })
})

app.use("/auth", authRoutes)
app.use("/servicios", serviciosRoutes)
app.use("/reservas", reservasRoutes)
app.use("/usuarios", usuariosRoutes)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ error: "Error en el servidor" })
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor escuchando en el puerto " + (process.env.PORT || 3000))
})
