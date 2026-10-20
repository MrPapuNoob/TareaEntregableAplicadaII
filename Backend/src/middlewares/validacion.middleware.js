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

export const validarId = (req, res, next) => {
  const { id } = req.params
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "id invalido" })
  }
  next()
}
