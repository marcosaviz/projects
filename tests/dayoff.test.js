const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');



let employeeId;

beforeAll(async () => {
  //Apagar as tabelas que têm FK para employees
  // await db.query('DELETE FROM vacations');
  // await db.query('DELETE FROM dayoffs');
  // await db.query('DELETE FROM shifts');

  // Agora pode apagar os employees
  // await db.query('DELETE FROM employees');

  // Inserir funcionário para os testes
  const [rows] = await db.query(
    'INSERT INTO employees (name, birth_date) VALUES (?, ?)',
    ['Ciclano', '1980-07-11']
  );
  employeeId = rows.insertId;
});

afterAll(async () => {
  // await db.query('DELETE FROM vacations');
  // await db.query('DELETE FROM dayoffs');
  // await db.query('DELETE FROM shifts');
  // await db.query('DELETE FROM employees');
  await db.end();

  // Workaround para Jest evitar handle pendente
  await new Promise(resolve => setTimeout(resolve, 100));
});


describe('Dayoff API', () => {
  it('Deve retornar erro ao tentar criar dayoff com employee_id inexistente', async () => {
    const response = await request(app)
      .post('/api/dayoffs')
      .send({
        employee_id: 99999,
        day: '2025-07-11',
        reason: 'Teste'
      });

    expect([400, 404]).toContain(response.statusCode); // aceita ambos
  });

  it('Deve criar dayoff de aniversário', async () => {
    const response = await request(app)
      .post('/api/dayoffs')
      .send({
        employee_id: employeeId,
        day: '2025-07-11',
        reason: 'Aniversário'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Deve listar todos os dayoffs', async () => {
    const response = await request(app).get('/api/dayoffs');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
