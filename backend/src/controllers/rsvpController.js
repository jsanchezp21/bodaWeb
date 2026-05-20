import { GuestResponse } from '../models/GuestResponse.js';
import { buildRsvpExcelBuffer } from '../utils/excelExport.js';

export async function createRsvp(req, res) {
  try {
    const payload = normalizeRsvpPayload(req.body);
    const response = await GuestResponse.create(payload);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({
      message: 'No se pudo guardar la respuesta',
      error: error.message,
    });
  }
}

export async function getRsvps(req, res) {
  const responses = await GuestResponse.find().sort({ createdAt: -1 });
  return res.json(responses);
}

export async function exportRsvps(req, res) {
  const responses = await GuestResponse.find().sort({ createdAt: -1 }).lean();
  const buffer = buildRsvpExcelBuffer(responses);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename="respuestas-boda.xlsx"');

  return res.send(buffer);
}

export const deleteRsvp = async (req, res) => {
  try {
    const deletedRsvp = await GuestResponse.findByIdAndDelete(req.params.id);

    if (!deletedRsvp) {
      return res.status(404).json({
        message: 'Respuesta no encontrada'
      });
    }

    return res.json({
      message: 'Respuesta eliminada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la respuesta',
      error: error.message
    });
  }
};

function normalizeRsvpPayload(body) {
  const companionsCount = Number(body.companionsCount || 0);
  const companions = Array.isArray(body.companions) ? body.companions : [];

  return {
    fullName: body.fullName,
    attendance: body.attendance,
    companionsCount,
    companions: companions.slice(0, companionsCount).map((companion) => ({
      fullName: companion.fullName,
    })),
    busOption: body.busOption,
    allergies: body.allergies || '',
    foodPreference: body.foodPreference || 'none',
    mustPlaySong: body.mustPlaySong || '',
  };
}
