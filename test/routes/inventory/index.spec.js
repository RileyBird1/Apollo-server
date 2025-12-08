const request = require('supertest');
const app = require ('../../../src/app').app;
const { Inventory } = require('../../../src/models/inventory');

jest.mock('../../../src/models/inventory'); // Mock the Inventory model

beforeAll(() => {
    // Mock console methods to avoid cluttering test output
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});


describe('Inventory API', ()=> {
    describe('GET /api/inventory/:itemId', ()=> {
        // Test 1
        it('should get an inventory by itemId', async ()=> {
            Inventory.findOne.mockResolvedValue({ name: 'Water Boiler' }); // Mock the findOne method

            const response = await request(app).get('/api/inventory/101');

            expect(response.status).toBe(200);
            expect(response.body.name).toBe('Water Boiler');
        });

        // Test 2
        it('should handle errors', async ()=> {
            Inventory.findOne.mockRejectedValue(new Error('Database error')); // Mock an error

            const response = await request(app).get('/api/inventory/101');

            expect(response.status).toBe(500);
        });

        // Test 3
        it('should return 404 if inventory item is not found', async () => {
            Inventory.findOne.mockResolvedValue(null); // Mock no document found

            const response = await request(app).get('/api/inventory/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual(
                expect.objectContaining({
                    message: 'Inventory item not found'
                })
            )
        });
    });
});