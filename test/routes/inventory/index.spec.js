const request = require('supertest');
const app = require ('../../../src/app');
const { Inventory } = require('../../../src/models/inventory');

jest.mock('../../../src/models/inventory'); // Mock the Inventory model

beforeAll(() => {
    // Mock console methods to avoid cluttering test output
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});


describe('Inventory API', ()=> {
    // Test suite for GET /api/inventory/:itemId
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


    // Test suite for PATCH /api/inventory/:itemId
    describe('PATCH/api/inventory/:itemId', ()=> {
        // Test 1: when update is successful
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
            expect(response.body.message).toBe('Inventory item updated successfully!');
        });
        
        // Test 2: invalid input data
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

        // Test 3: test for error handling
        it('should handle errors during update', async ()=> {
            Inventory.findOne.mockRejectedValue(new Error('Database error')); // Mock an error

            const response = await request(app).patch('/api/inventory/1').send({
                name: 'Updated Inventory Item',
                description: 'An updated description for the inventory item',
                quantity: 2,
                price: 30.00
            });

            expect(response.status).toBe(500);
        });
    });

    // Test suite for GET /api/inventory/
    describe('GET /api/inventory', ()=> {
        // Test 1: successful retrieval of all inventory items
        it('should get all inventory items', async ()=> {
            Inventory.find.mockResolvedValue([
                {
                    itemId: 123,
                    categoryId: 2,
                    supplierId: 1,
                    name: 'Widget',
                    description: 'A useful widget',
                    quantity: 100,
                    price: 9.99,
                    dateCreated: '2023-10-01T12:00:00Z',
                    dateModified: '2023-10-01T12:00:00Z'
                }
            ]); // Mock the find method

            const response = await request(app).get('/api/inventory');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0].name).toBe('Widget');
        });

        // Test 2: error handling during retrieval
        it('should handle errors during retrieval of all inventory items', async ()=> {
            Inventory.find.mockRejectedValue(new Error('Database error')); // Mock an error

            const response = await request(app).get('/api/inventory');

            expect(response.status).toBe(500);
        });

        // Test 3: when no inventory items are found
        it('should return 404 when no inventory items are found', async () => {
            Inventory.find.mockResolvedValue([]); // Mock no documents found

            const response = await request(app).get('/api/inventory');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No inventory items found');
           
        });
    });

});