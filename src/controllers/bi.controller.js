import { sequelize } from '../config/db.js';

export const getBIDataset = async (req, res) => {
  try {
    const query = `
      SELECT 
        z.zona_id,
        z.nombre AS zona,
        m.fecha_hora,
        m.pm25,
        m.pm10,
        m.no2,
        m.temperatura,
        m.humedad_relativa,
        m.precipitacion,
        m.presion_superficial,
        m.velocidad_viento,
        m.direccion_viento
      FROM mediciones_aire m
      JOIN zonas z ON z.zona_id = m.zona_id
      ORDER BY m.fecha_hora DESC
    `;

    const [rows] = await sequelize.query(query);

    res.json(rows);
  } catch (error) {
    console.error("Error BI:", error);
    res.status(500).json({ error: "Error obteniendo datos para BI" });
  }
};
