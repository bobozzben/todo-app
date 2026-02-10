import request from 'supertest';
import app from '../index';

const mockTasks = [
  { id: 1, title: 't1', description: 'd1', completed: false, createdAt: new Date(), updatedAt: new Date() },
];

jest.mock('../prismaClient', () => ({
  __esModule: true,
  default: {
    task: {
      findMany: jest.fn(() => Promise.resolve(mockTasks)),
      findUnique: jest.fn(({ where }: any) => Promise.resolve(mockTasks.find(t => t.id === where.id) || null)),
      create: jest.fn(({ data }: any) => Promise.resolve({ id: 2, ...data, createdAt: new Date(), updatedAt: new Date() })),
      update: jest.fn(({ where, data }: any) => Promise.resolve({ id: where.id, ...data, createdAt: new Date(), updatedAt: new Date() })),
      delete: jest.fn(() => Promise.resolve()),
    }
  }
}));

describe('Tasks API', () => {
  it('GET /api/tasks returns list', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/tasks creates task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'new task' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('new task');
  });
});
