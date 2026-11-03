import jwt from "jsonwebtoken"

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  if (!authHeader) return res.status(401).json({ error: "Token requerido" })

  const token = authHeader.split(" ")[1]
  if (!token) return res.status(401).json({ error: "Token requerido" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch {
    res.status(401).json({ error: "Token invalido" })
  }
}
