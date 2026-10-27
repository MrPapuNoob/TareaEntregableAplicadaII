export const validarRegistro = (req, res, next) => {
  const { nombre, email, password } = req.body
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "nombre, email y password son requeridos" })
  }
  next()
}

export const validarLogin = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "email y password son requeridos" })
  }
  next()
}

export const validarServicio = (req, res, next) => {
  const { nombre, descripcion, duracion, precio } = req.body
  if (!nombre || !descripcion || !duracion || precio === undefined) {
    return res.status(400).json({ error: "nombre, descripcion, duracion y precio son requeridos" })
  }
  if (isNaN(Number(duracion)) || isNaN(Number(precio))) {
    return res.status(400).json({ error: "duracion y precio deben ser numeros" })
  }
  next()
}

export const validarReserva = (req, res, next) => {
  const { servicioId, fecha, hora } = req.body
  if (!servicioId || !fecha || !hora) {
    return res.status(400).json({ error: "servicioId, fecha y hora son requeridos" })
  }
  // fecha: AAAA-MM-DD, hora: HH:MM
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora)) {
    return res.status(400).json({ error: "La fecha debe ser AAAA-MM-DD y la hora HH:MM" })
  }
  next()
}

export const validarEstado = (req, res, next) => {
  const { estado } = req.body
  if (estado !== "pendiente" && estado !== "completada" && estado !== "cancelada") {
    return res.status(400).json({ error: "El estado debe ser pendiente, completada o cancelada" })
  }
  next()
}

export const validarId = (req, res, next) => {
  const { id } = req.params
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "id invalido" })
  }
  next()
}
