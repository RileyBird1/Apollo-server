const request = require('supertest');
const app = require ('../../../src/app').app;
const app = require ('../../../src/app');
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
    describe('PATCH/api/inventory/:itemId', ()=> {
        it('should update a garden successfully', async () => {
            Inventory.findOne.mockResolvedValue({
                set: jest.fn(),
                save: jest.fn().mockResolvedValue({ itemId: 1 })
            }) // Mock the findOne and save methods

            const response = await request(app).patch('/api/inventory/1').send({
                name: 'Updated Inventory Item',
                description: 'An updated description for the inventory item',
                quantity: 2,
                price: 30.00
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Inventory updated item successfully!');
        });
        
        it('should return validation errors for invalid data', async() =>{
            const response = await request(app).patch('/api/inventory/1').send({
                name: 'UG',
                description:'',
                quantity: 1,
                price: 20.00
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Must not have fewer than 3 characters.');
        });
    });
});