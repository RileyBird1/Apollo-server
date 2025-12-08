describe('DELETE /api/inventory/:itemId', () => {
  let createdItemId;

  beforeEach(async () => {
    // Create a test item to delete
    const item = new Inventory({
      supplierId: 2,
      name: 'Delete Me',
      description: 'To be deleted',
      quantity: 5,
      price: 10.99
    });
    await item.save();
    createdItemId = item.itemId;
  });

  afterEach(async () => {
    await Inventory.deleteMany({ name: 'Delete Me' });
  });

  // Test 1: Should delete an existing inventory item
  it('should delete an existing inventory item', async () => {
    const res = await request(app)
      .delete(`/api/inventory/${createdItemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item deleted');
    expect(res.body.item.name).toBe('Delete Me');
  });

  // Test 2: Should return 404 if item does not exist
  it('should return 404 if item does not exist', async () => {
    const res = await request(app)
      .delete(`/api/inventory/999999`);
    expect(res.statusCode).toBe(404);
    expect(res.body.error || res.body.message).toContain('not found');
  });

  // Test 3: Should handle invalid itemId gracefully
  it('should handle invalid itemId gracefully', async () => {
    const res = await request(app)
      .delete(`/api/inventory/invalid-id`);
    expect(res.statusCode).toBe(400);
  });
});
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
