import { prisma } from "../db.js"

// Campos que se devuelven del usuario (nunca la contraseña)
const camposPublicos = { id: true, nombre: true, email: true, rol: true }

export const getPerfil = async (req, res, next) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: camposPublicos
    })
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" })
    res.json(usuario)
  } catch (err) {
    next(err)
  }
}

export const actualizarPerfil = async (req, res, next) => {
  try {
    const { nombre } = req.body
    const existe = await prisma.usuario.findUnique({ where: { id: req.usuario.id } })
    if (!existe) return res.status(404).json({ error: "Usuario no encontrado" })

    const usuario = await prisma.usuario.update({
      where: { id: req.usuario.id },
      data: { nombre: nombre.trim() },
      select: camposPublicos
    })
    res.json(usuario)
  } catch (err) {
    next(err)
  }
}
