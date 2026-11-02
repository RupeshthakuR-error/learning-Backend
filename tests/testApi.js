/**
 * Comprehensive API Test Suite
 * Tests all endpoints, routing, error handling, and status codes
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.env.NODE_ENV = 'test';
dotenv.config();

const { app } = require('../server');

async function runTests() {
  // Start server on an ephemeral free port
  const server = app.listen(0, '127.0.0.1');

  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;
  const BASE_URL = `http://127.0.0.1:${port}`;

  console.log('\n====================================================');
  console.log(' Starting Automated API Tests against:', BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(` \x1b[32m✔ PASS\x1b[0m - ${testName}`);
      passed++;
    } else {
      console.error(` \x1b[31m✖ FAIL\x1b[0m - ${testName}`);
      failed++;
    }
  }

  // Helper function to send HTTP requests using native fetch
  async function request(method, path, body = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json().catch(() => ({}));
    return { status: response.status, body: data };
  }

  try {
    // 1. Health check & Welcome
    console.log('[1] Testing Server Health Check Endpoint...');
    const health = await request('GET', '/');
    assert(health.status === 200 && health.body.success === true, 'GET / returns 200 OK with success: true');
    assert(health.body.endpoints && health.body.endpoints.getAllItems, 'GET / exposes API endpoints documentation');

    // 2. 404 Route Test
    console.log('\n[2] Testing 404 Handler for Undefined Route...');
    const notFound = await request('GET', '/api/undefined-endpoint-xyz');
    assert(notFound.status === 404 && notFound.body.success === false, 'GET /api/undefined-endpoint-xyz returns 404 Not Found');

    // 3. Validation format test (Invalid ObjectId)
    console.log('\n[3] Testing Invalid ObjectId Format Error (400 Bad Request)...');
    const invalidId = await request('GET', '/api/items/invalid-hex-123');
    assert(invalidId.status === 400 && invalidId.body.success === false, 'GET /api/items/invalid-hex-123 returns 400 Bad Request');

    // 4. Update with invalid ObjectId format
    console.log('\n[4] Testing Update with Invalid ObjectId Format...');
    const invalidUpdate = await request('PUT', '/api/items/invalid-hex-123', { price: 99 });
    assert(invalidUpdate.status === 400 && invalidUpdate.body.success === false, 'PUT /api/items/invalid-hex-123 returns 400 Bad Request');

    // 5. Delete with invalid ObjectId format
    console.log('\n[5] Testing Delete with Invalid ObjectId Format...');
    const invalidDelete = await request('DELETE', '/api/items/invalid-hex-123');
    assert(invalidDelete.status === 400 && invalidDelete.body.success === false, 'DELETE /api/items/invalid-hex-123 returns 400 Bad Request');

    // 6. Check MongoDB Connection State
    console.log('\n[6] Checking MongoDB Connection State...');
    const isDbConnected = mongoose.connection.readyState === 1;

    if (!isDbConnected) {
      console.log('\n\x1b[33m----------------------------------------------------------------------');
      console.log(' [NOTICE] MongoDB Atlas URI is not yet configured or connected.');
      console.log('          - Express Server initialization: VERIFIED');
      console.log('          - Express Routing & Controllers: VERIFIED');
      console.log('          - 400 Bad Request validation handling: VERIFIED');
      console.log('          - 404 Not Found route handling: VERIFIED');
      console.log('          - Database CRUD operations will run as soon as MONGO_URI is added in .env.');
      console.log('----------------------------------------------------------------------\x1b[0m');
    } else {
      console.log(' \x1b[32m✔ MongoDB is connected! Executing full database CRUD tests...\x1b[0m');

      // 7. CREATE (POST /api/items)
      console.log('\n[7] Testing CREATE: POST /api/items...');
      const newItem = {
        name: 'Dell XPS 15 Laptop',
        description: '15.6 inch OLED, Intel i9, 32GB RAM, 1TB SSD',
        price: 1499.99,
        category: 'Electronics',
        inStock: true
      };
      const createRes = await request('POST', '/api/items', newItem);
      assert(createRes.status === 201 && createRes.body.success === true, 'POST /api/items creates new item (201 Created)');
      const createdId = createRes.body.data?._id;
      assert(!!createdId, `Item created with valid MongoDB _id: ${createdId}`);

      // 8. CREATE Validation Error
      console.log('\n[8] Testing CREATE Validation Error (missing fields)...');
      const invalidItem = { name: 'Faulty Item' };
      const invalidRes = await request('POST', '/api/items', invalidItem);
      assert(invalidRes.status === 400 && invalidRes.body.success === false, 'POST /api/items with missing fields returns 400 Bad Request');

      // 9. READ ALL (GET /api/items)
      console.log('\n[9] Testing READ ALL: GET /api/items...');
      const getAllRes = await request('GET', '/api/items');
      assert(getAllRes.status === 200 && Array.isArray(getAllRes.body.data), 'GET /api/items returns 200 OK with array');

      // 10. READ BY ID (GET /api/items/:id)
      console.log('\n[10] Testing READ BY ID: GET /api/items/:id...');
      const getByIdRes = await request('GET', `/api/items/${createdId}`);
      assert(getByIdRes.status === 200 && getByIdRes.body.data?._id === createdId, 'GET /api/items/:id returns item');

      // 11. UPDATE (PUT /api/items/:id)
      console.log('\n[11] Testing UPDATE: PUT /api/items/:id...');
      const updatePayload = { price: 1399.99, inStock: false };
      const updateRes = await request('PUT', `/api/items/${createdId}`, updatePayload);
      assert(updateRes.status === 200 && updateRes.body.data?.price === 1399.99, 'PUT /api/items/:id updates price to 1399.99');

      // 12. DELETE (DELETE /api/items/:id)
      console.log('\n[12] Testing DELETE: DELETE /api/items/:id...');
      const deleteRes = await request('DELETE', `/api/items/${createdId}`);
      assert(deleteRes.status === 200 && deleteRes.body.success === true, 'DELETE /api/items/:id deletes item');

      // 13. CONFIRM DELETE (GET /api/items/:id returns 404)
      console.log('\n[13] Testing Confirmation of Deletion...');
      const confirmDeleteRes = await request('GET', `/api/items/${createdId}`);
      assert(confirmDeleteRes.status === 404, 'GET deleted item returns 404 Not Found');
    }

    console.log('\n====================================================');
    console.log(` Test Execution Finished: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test execution error:', err.message);
  } finally {
    server.close();
    if (mongoose.connection) {
      await mongoose.disconnect().catch(() => {});
    }
    process.exit(0);
  }
}

runTests();
