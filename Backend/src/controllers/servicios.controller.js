import { prisma } from "../db.js"

export const getServicios = async (req, res, next) => {
  try {
    const servicios = await prisma.servicio.findMany({ orderBy: { id: "asc" } })
    res.json(servicios)
  } catch (err) {
    next(err)
  }
}

export const getServicio = async (req, res, next) => {
  try {
    const { id } = req.params
    const servicio = await prisma.servicio.findUnique({ where: { id: Number(id) } })
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" })
    res.json(servicio)
  } catch (err) {
    next(err)
  }
}

export const createServicio = async (req, res, next) => {
  try {
    const { nombre, descripcion, duracion, precio } = req.body
    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        duracion: Number(duracion),
        precio: Number(precio)
      }
    })
    res.status(201).json(servicio)
  } catch (err) {
    next(err)
  }
}

export const updateServicio = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, duracion, precio } = req.body
    const existe = await prisma.servicio.findUnique({ where: { id: Number(id) } })
    if (!existe) return res.status(404).json({ error: "Servicio no encontrado" })

    const servicio = await prisma.servicio.update({
      where: { id: Number(id) },
      data: {
        nombre,
        descripcion,
        duracion: Number(duracion),
        precio: Number(precio)
      }
    })
    res.json(servicio)
  } catch (err) {
    next(err)
  }
}

export const deleteServicio = async (req, res, next) => {
  try {
    const { id } = req.params
    const existe = await prisma.servicio.findUnique({ where: { id: Number(id) } })
    if (!existe) return res.status(404).json({ error: "Servicio no encontrado" })

    await prisma.servicio.delete({
      where: { id: Number(id) }
    })
    res.json({ message: "Servicio eliminado" })
  } catch (err) {
    next(err)
  }
}
