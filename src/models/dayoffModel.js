const db = require('../config/database');
const { convertToCamelCase } = require('../utils/convertToCamelCase');


// Função auxiliar para formatar datas
const formatData = (date) => new Date(date).toISOString().split('T')[0];


const DayOff = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM dayoffs');
    return convertToCamelCase(rows);
  },

  create: async ({ employee_id, day, reason }) => {
    // Convertendo a data para o formato aceito pelo MySQL
    const formattedDate = formatData(day);
    const [result] = await db.query(
      'INSERT INTO dayoffs (employee_id, day, reason) VALUES (?, ?, ?)',
      [employee_id, formattedDate, reason]
    );
    return { id: result.insertId, employee_id, day: formattedDate, reason };
  },

  // Método para encontrar um dayoff existente por employee_id e day
  findByEmployeeAndDay: async (employee_id, day) => {
    const [rows] = await db.query(
      'SELECT * FROM dayoffs WHERE employee_id = ? AND day = ?',
      [employee_id, day]
    );
    return convertToCamelCase(rows)[0]; // Retorna o primeiro registro encontrado, ou undefined se não houver.
  }
};

module.exports = DayOff;
