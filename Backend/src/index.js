import "dotenv/config"
import express from "express"
import { logger } from "./middlewares/logger.middleware.js"
import authRoutes from "./routes/auth.routes.js"
import serviciosRoutes from "./routes/servicios.routes.js"

const app = express()
app.use(logger)
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "API de servicios funcionando" })
})

app.use("/auth", authRoutes)
app.use("/servicios", serviciosRoutes)

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).json({ error: "Error en el servidor" })
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor escuchando en el puerto " + (process.env.PORT || 3000))
})
