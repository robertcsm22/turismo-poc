import { useState, useEffect } from 'react'
import { placeService, townService } from '../services/api'

export default function AdminPlacesPage() {

  const [places, setPlaces] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'PARQUE',
    address: '',
    imageUrl: ''
  })

  useEffect(() => {
    loadPlaces()
  }, [])

  const loadPlaces = () => {
    townService.getPlaces('santa-teresa')
      .then((data) => {
        setPlaces(data)
      })
      .catch(console.error)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const townId = 1

      const result = await placeService.createPlace(
        townId,
        formData
      )

      console.log('Lugar creado:', result)

      alert('Lugar guardado correctamente')

      setFormData({
        name: '',
        description: '',
        category: 'PARQUE',
        address: '',
        imageUrl: ''
      })

      loadPlaces()

    } catch (error) {

      console.error(error)

      alert('Error al guardar el lugar')
    }
  }
    
    const handleDelete = async (id) => {

  const confirmar = window.confirm(
    '¿Deseas eliminar este lugar?'
  )

  if (!confirmar) return

  try {

    await placeService.deletePlace(id)

    alert('Lugar eliminado correctamente')

    loadPlaces()

  } catch (error) {

    console.error(error)

    alert('Error al eliminar lugar')
  }
}

  return (
    <div className="container py-4">

      <h2 className="mb-4">
        ⚙️ Administración de Lugares
      </h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="PARQUE">Parque</option>
            <option value="PLAYA">Playa</option>
            <option value="HOTEL">Hotel</option>
            <option value="MIRADOR">Mirador</option>
            <option value="RESTAURANTE">Restaurante</option>
            <option value="MUSEO">Museo</option>
            <option value="CULTURAL">Cultural</option>
            <option value="GASTRONOMIA">Gastronomía</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">URL Imagen</label>
          <input
            type="text"
            className="form-control"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">
          Guardar Lugar
        </button>

      </form>

      <div className="mt-4">

        <h3>📍 Lugares registrados</h3>

        <ul className="list-group">

          {places.map((place) => (

            <li
              key={place.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {place.name}
              </span>

              <div>
                <button className="btn btn-warning btn-sm me-2">
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                   onClick={() => handleDelete(place.id)}
                >
                   Eliminar
                </button>
              </div>

            </li>

          ))}

        </ul>

      </div>

    </div>
  )
}