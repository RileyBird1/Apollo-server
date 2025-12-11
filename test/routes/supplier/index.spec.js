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
