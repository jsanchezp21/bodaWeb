import xlsx from 'xlsx';

const attendanceLabels = {
  yes: 'Sí, voy preparando los zapatos de bailar',
  no: 'No puedo ir, pero brindaré por vosotros desde la distancia',
};

const busLabels = {
  round_trip: 'Sí, ida y vuelta',
  only_go: 'Solo ida',
  only_return: 'Solo vuelta',
  no_bus: 'No necesito autobús',
};

const foodLabels = {
  none: 'Sin preferencia especial',
  vegetarian: 'Vegetariano/a',
  vegan: 'Vegano/a',
};

export function buildRsvpExcelBuffer(responses) {
  const rows = responses.map((response) => ({
    'Fecha de respuesta': formatDate(response.createdAt),
    'Nombre y apellidos': response.fullName,
    'Asistencia': attendanceLabels[response.attendance] || response.attendance,
    'Número de acompañantes': response.companionsCount,
    'Acompañantes': response.companions?.map((c) => c.fullName).join(', ') || '',
    'Autobús': busLabels[response.busOption] || response.busOption,
    'Alergias o intolerancias': response.allergies || '',
    'Menú especial': foodLabels[response.foodPreference] || response.foodPreference,
    'Canción imprescindible': response.mustPlaySong || '',
  }));

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 22 },
    { wch: 28 },
    { wch: 52 },
    { wch: 22 },
    { wch: 45 },
    { wch: 24 },
    { wch: 35 },
    { wch: 22 },
    { wch: 35 },
  ];

  xlsx.utils.book_append_sheet(workbook, worksheet, 'Respuestas');
  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
}
