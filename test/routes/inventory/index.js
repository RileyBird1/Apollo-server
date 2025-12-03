const request = require('supertest');
const app = require('../../../src/app').app;
const { Inventory } = require('../../../src/models/inventory');

describe('POST /api/inventory', () => {
  // Clean up test data after each test
  afterEach(async () => {
    await Inventory.deleteMany({ name: 'Test Item' });
  });

  // Test 1: Should create inventory item with valid data
  it('should create inventory item with valid data', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({
        supplierId: 1,
        name: 'Test Item',
        description: 'Test Description',
        quantity: 10,
        price: 99.99
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Item');
    expect(res.body.quantity).toBe(10);
  });

  // Test 2: Should fail if required fields are missing
  it('should fail if name is missing', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({
        supplierId: 1,
        description: 'Test Description',
        quantity: 10,
        price: 99.99
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('name');
  });

  // Test 3: Should fail if quantity is negative
  it('should fail if quantity is negative', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .send({
        supplierId: 1,
        name: 'Test Item',
        description: 'Test Description',
        quantity: -5,
        price: 99.99
      });
    expect(res.statusCode).toBe(400);
  });
});
