import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  // Cargar tareas desde localStorage
  const [tareas, setTareas] = useState(() => {
    const tareasGuardadas = localStorage.getItem("tareas");
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  });

  const [nuevaTarea, setNuevaTarea] = useState('');
  const [duracion, setDuracion] = useState('');
  const [filtroDuracion, setFiltroDuracion] = useState(0);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  // Calcular tiempo total de forma optimizada
  const calcularTiempoTotal = useMemo(() => {
    return tareas.reduce((total, tarea) => total + tarea.duracion, 0);
  }, [tareas]);

  // Actualizar el título del documento
  useEffect(() => {
    document.title = `Total: ${calcularTiempoTotal} minutos`;
  }, [calcularTiempoTotal]);

  // Agregar nueva tarea
  const agregarTarea = () => {
    if (nuevaTarea && duracion) {
      const nueva = {
        nombre: nuevaTarea,
        duracion: parseInt(duracion)
      };
      setTareas([...tareas, nueva]);
      setNuevaTarea('');
      setDuracion('');
    }
  };

  // Eliminar una tarea
  const eliminarTarea = (index) => {
    const nuevasTareas = tareas.filter((_, i) => i !== index);
    setTareas(nuevasTareas);
  };

  // Filtrar tareas por duración
  const tareasFiltradas = tareas.filter(t => t.duracion >= filtroDuracion);

  return (
    <div className="contenedor">
      <h1>Contador de Tareas</h1>

      <div className="formulario">
        <input 
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nombre de la tarea"
        />
        <input 
          type="number"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          placeholder="Duración en minutos"
        />
        <button onClick={agregarTarea}>Agregar tarea</button>
      </div>

      <div className="filtro">
        <label>Filtrar por duración mínima:</label>
        <input
          type="number"
          value={filtroDuracion}
          onChange={(e) => setFiltroDuracion(Number(e.target.value))}
        />
      </div>

      <h2>Tareas</h2>
      {tareasFiltradas.length === 0 ? (
        <p>No hay tareas para mostrar.</p>
      ) : (
        <ul>
          {tareasFiltradas.map((tarea, index) => (
            <li key={index}>
              {tarea.nombre}: {tarea.duracion} minutos
              <button className="btn-eliminar" onClick={() => eliminarTarea(index)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total de tiempo: {calcularTiempoTotal} minutos</h3>
    </div>
  );
}

export default App;
