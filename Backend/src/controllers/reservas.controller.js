import { prisma } from "../db.js"

export const crearReserva = async (req, res, next) => {
  try {
    const { servicioId, fecha, hora } = req.body
    const servicio = await prisma.servicio.findUnique({ where: { id: Number(servicioId) } })
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" })

    // No se puede reservar una fecha pasada
    const fechaReserva = new Date(`${fecha}T${hora}:00`)
    if (isNaN(fechaReserva.getTime())) {
      return res.status(400).json({ error: "Fecha u hora invalida" })
    }
    if (fechaReserva < new Date()) {
      return res.status(400).json({ error: "No se puede reservar una fecha pasada" })
    }

    // El estado inicial siempre es pendiente
    const reserva = await prisma.reserva.create({
      data: {
        fecha,
        hora,
        estado: "pendiente",
        servicioId: servicio.id,
        usuarioId: req.usuario.id
      }
    })
    res.status(201).json(reserva)
  } catch (err) {
    next(err)
  }
}

export const getMisReservas = async (req, res, next) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.usuario.id },
      include: { servicio: true },
      orderBy: { id: "desc" }
    })
    res.json(reservas)
  } catch (err) {
    next(err)
  }
}

export const getReservas = async (req, res, next) => {
  try {
    const reservas = await prisma.reserva.findMany({
      include: {
        servicio: true,
        usuario: { select: { id: true, nombre: true, email: true } }
      },
      orderBy: { id: "desc" }
    })
    res.json(reservas)
  } catch (err) {
    next(err)
  }
}

export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params
    const { estado } = req.body
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" })

    const reservaActualizada = await prisma.reserva.update({
      where: { id: reserva.id },
      data: { estado }
    })
    res.json(reservaActualizada)
  } catch (err) {
    next(err)
  }
}

export const cancelarReserva = async (req, res, next) => {
  try {
    const { id } = req.params
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" })

    // Un cliente solo puede cancelar sus propias reservas
    if (reserva.usuarioId !== req.usuario.id) {
      return res.status(403).json({ error: "No autorizado" })
    }
    if (reserva.estado !== "pendiente") {
      return res.status(400).json({ error: "Solo se pueden cancelar reservas pendientes" })
    }

    const reservaCancelada = await prisma.reserva.update({
      where: { id: reserva.id },
      data: { estado: "cancelada" }
    })
    res.json(reservaCancelada)
  } catch (err) {
    next(err)
  }
}
