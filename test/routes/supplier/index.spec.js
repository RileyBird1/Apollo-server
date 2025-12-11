const request = require('supertest');
const app = require('../../../src/app').app;
const { Supplier } = require('../../../src/models/supplier');

describe('POST /api/supplier', () => {
  // Clean up test data after each test
  afterEach(async () => {
    await Supplier.deleteMany({ supplierName: 'Test Supplier' });
  });

  // Test 1: Should create supplier with valid data
  it('should create supplier with valid data', async () => {
    const res = await request(app)
      .post('/api/supplier')
      .send({
        supplierId: 123,
        supplierName: 'Test Supplier',
        contactInformation: 'test@example.com',
        address: '123 Test St.'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.supplierName).toBe('Test Supplier');
    expect(res.body.supplierId).toBe(123);
  });

  // Test 2: Should fail if required fields are missing
  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/supplier')
      .send({
        supplierId: 123,
        supplierName: 'Test Supplier',
        contactInformation: 'test@example.com'
        // address missing
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('required');
  });

  // Test 3: Should fail if supplierId is missing
  it('should fail if supplierId is missing', async () => {
    const res = await request(app)
      .post('/api/supplier')
      .send({
        supplierName: 'Test Supplier',
        contactInformation: 'test@example.com',
        address: '123 Test St.'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain('required');
  });
});
<<<<<<< HEAD

describe('GET /api/supplier', () => {
  beforeEach(async () => {
    await Supplier.deleteMany({});
  });

  it('should return all suppliers', async () => {
    await Supplier.create([
      { supplierId: 1, supplierName: 'Supplier A', contactInformation: 'a@email.com', address: '123 Main St' },
      { supplierId: 2, supplierName: 'Supplier B', contactInformation: 'b@email.com', address: '456 Oak Ave' }
    ]);
    const res = await request(app).get('/api/supplier');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].supplierName).toBe('Supplier A');
    expect(res.body[1].supplierName).toBe('Supplier B');
  });

  it('should return empty array if no suppliers', async () => {
    const res = await request(app).get('/api/supplier');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should handle server error', async () => {
    // Temporarily stub Supplier.find to throw
    const origFind = Supplier.find;
    Supplier.find = () => { throw new Error('DB error'); };
    const res = await request(app).get('/api/supplier');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined();
    Supplier.find = origFind;
  });
});
=======
>>>>>>> 32f666727c61d1d0dbe1fa93b14fd52786b50894
