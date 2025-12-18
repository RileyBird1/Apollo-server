const request = require('supertest');
const app = require('../../../src/app');
const { Supplier } = require('../../../src/models/supplier');

jest.mock('../../../src/models/supplier'); // Mock the Supplier model

beforeAll(() => {
    // Mock console methods to avoid cluttering test output
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Supplier API', () => {

    // Test suite for GET /api/supplier/:supplierId
    describe("GET /api/supplier/supplierId", () => {
      // TEST 1 — Successfully return a supplier
      it("should return a supplier when found", async () => {
        Supplier.findOne.mockResolvedValue({
          supplierId: 1,
          supplierName: "TechSupplier",
          contactInformation: "123-456-7890",
          address: "123 Tech Street",
          dateCreated: "2023-10-01T12:00:00Z",
          dateModified: "2023-10-01T12:00:00Z",
        });

        const res = await request(app).get("/api/supplier/1");

        expect(res.status).toBe(200);
        expect(res.body.supplierName).toBe("TechSupplier");
        expect(Supplier.findOne).toHaveBeenCalledWith({ supplierId: 1 });
      });

      // TEST 2 — Return 404 when supplier does not exist
      it("should return 404 when supplier is not found", async () => {
        Supplier.findOne.mockResolvedValue(null); // no supplier found

        const res = await request(app).get("/api/supplier/999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Supplier not found");
      });

      // TEST 3 — Handle internal server errors (500)
      it("should return 500 when a database error occurs", async () => {
        Supplier.findOne.mockRejectedValue(new Error("Database failure"));

        const res = await request(app).get("/api/supplier/2");

        expect(res.status).toBe(500);
      });
    });

    // Test suite for POST /api/supplier
    describe("POST /api/supplier", () => {
      // Clean up test data after each test
      afterEach(async () => {
        await Supplier.deleteMany({ supplierName: "Test Supplier" });
      });

      // Test 1: Should create supplier with valid data
      it("should create supplier with valid data", async () => {
        const mockSupplier = {
          supplierId: 123,
          supplierName: "Test Supplier",
          contactInformation: "test@example.com",
          address: "123 Test St.",
          dateCreated: new Date(),
          dateModified: new Date(),
          save: jest.fn().mockResolvedValue({
            supplierId: 123,
            supplierName: "Test Supplier",
            contactInformation: "test@example.com",
            address: "123 Test St.",
            dateCreated: new Date(),
            dateModified: new Date()
          })
        };
        const SupplierMock = jest.fn(() => mockSupplier);
        Supplier.mockImplementation(SupplierMock);
        const res = await request(app).post("/api/supplier").send({
          supplierId: 123,
          supplierName: "Test Supplier",
          contactInformation: "test@example.com",
          address: "123 Test St.",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.supplierName).toBe("Test Supplier");
        expect(res.body.supplierId).toBe(123);
      });

      // Test 2: Should fail if required fields are missing
      it("should fail if required fields are missing", async () => {
        const res = await request(app).post("/api/supplier").send({
          supplierId: 123,
          supplierName: "Test Supplier",
          contactInformation: "test@example.com",
          // address missing
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain("required");
      });
    });

    // Test suite for GET /api/supplier
    describe("GET /api/supplier", () => {
      beforeEach(async () => {
        await Supplier.deleteMany({});
      });

      it("should return all suppliers", async () => {
        await Supplier.create([
          {
            supplierId: 1,
            supplierName: "Supplier A",
            contactInformation: "a@email.com",
            address: "123 Main St",
          },
          {
            supplierId: 2,
            supplierName: "Supplier B",
            contactInformation: "b@email.com",
            address: "456 Oak Ave",
          },
        ]);
        const res = await request(app).get("/api/supplier");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        expect(res.body[0].supplierName).toBe("Supplier A");
        expect(res.body[1].supplierName).toBe("Supplier B");
      });

      it("should return empty array if no suppliers", async () => {
        Supplier.find.mockResolvedValue([]);
        const res = await request(app).get("/api/supplier");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
      });

      it("should handle server error", async () => {
        // Temporarily stub Supplier.find to throw
        const origFind = Supplier.find;
        Supplier.find = () => {
          throw new Error("DB error");
        };
        const res = await request(app).get("/api/supplier");
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
        Supplier.find = origFind;
      });

      // Test 3: Should fail if supplierId is missing
      it("should fail if supplierId is missing", async () => {
        const res = await request(app).post("/api/supplier").send({
          supplierName: "Test Supplier",
          contactInformation: "test@example.com",
          address: "123 Test St.",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain("required");
      });
    });
});



      
  

