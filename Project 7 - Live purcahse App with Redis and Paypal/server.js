
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const redis = require('redis');
const paypal = require('@paypal/checkout-server-sdk');

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Client for regular Redis commands
const redisClient = redis.createClient({
    url: 'redis://redis-11329.c326.us-east-1-3.ec2.cloud.redislabs.com:11329',
    password: 'ogihXmdlCeBO3XT5BqdrwuAjv5jKH0oT'
});

// Client for Pub/Sub
const redisSub = redis.createClient({
    url: 'redis://redis-11329.c326.us-east-1-3.ec2.cloud.redislabs.com:11329',
    password: 'ogihXmdlCeBO3XT5BqdrwuAjv5jKH0oT'
});

// Connection and error event listeners for Redis clients
redisClient.on('connect', () => console.log('Connected to Redis for commands'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisSub.on('connect', () => console.log('Connected to Redis for Pub/Sub'));
redisSub.on('error', (err) => console.log('Redis Sub Client Error', err));

// Subscribe to Redis channels
redisSub.subscribe('vegetables', 'fruits', 'breads');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve the main HTML file on the root route
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => console.log('User disconnected'));
});

// Handle incoming messages on Redis channels
redisSub.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
  const item = JSON.parse(message);
  const uniqueId = generateUniqueId();
  const redisKey = `item:${uniqueId}`;

  redisClient.hset(redisKey, 'type', item.type, 'category', channel, 'price', item.price, 'calories', item.calories, 'grams', item.grams, (err, res) => {
    if (err) {
        console.error('Error storing item in Redis:', err);
        return;
    }
    console.log(`Item stored in Redis with key: ${redisKey}`);
    io.emit('newData', { id: uniqueId, category: channel, ...item });
  });
});

// PayPal SDK environment setup
function environment() {
  let clientId = 'AUEZvmaTayxN7uvq9r7Qp6fhVHuCFxWj7luLe4MIQJ4T4Luqd2o8SYFKC8FVMjXqH_dFPocAwl1BSEp_';
  let clientSecret = 'EPXIcVE2vzvsw6pBpJiOL9FU4HX0SjV3vRgvW50b9YFsZYSLtWTNbF9ifq4O8cPFvbRKPGuONQlQwGqc';

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

let client = new paypal.core.PayPalHttpClient(environment());

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to create a payment using PayPal
app.post('/create-payment', async (req, res) => {
  let totalCost = 0;
  const itemIds = req.body.itemIds;

  for (const id of itemIds) {
    try {
      const itemDetails = await getItemDetails(id);
      if (!itemDetails || !itemDetails.price) {
        throw new Error(`Item details not found for ID: ${id}`);
      }
      totalCost += parseFloat(itemDetails.price);
    } catch (err) {
      console.error(`Error retrieving item from Redis for ID ${id}:`, err);
      return res.status(500).json({ error: `Error retrieving item from Redis: ${err.message}` });
    }
  }

  // Validate total cost
  if (totalCost <= 0) {
    return res.status(400).json({ error: "Total cost must be greater than zero." });
  }

  // Create PayPal order
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: totalCost.toString(),
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: totalCost.toString()
          }
        }
      }
    }]
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error('Error creating PayPal order:', err);
    res.status(500).json({ error: err.message });
  }
});

// Helper function to get item details from Redis
function getItemDetails(uniqueId) {
  return new Promise((resolve, reject) => {
      const redisKey = `item:${uniqueId}`;
      redisClient.hgetall(redisKey, (err, item) => {
          if (err) {
              console.error(`Error retrieving item from Redis for ID ${uniqueId}:`, err);
              reject(err);
          } else {
              if (!item || !item.price) {
                  console.error(`Item details not found for ID ${uniqueId}`);
                  reject(new Error(`Item details not found for ID: ${uniqueId}`));
              } else {
                  resolve(item);
              }
          }
      });
  });
}

// Route to execute a payment after PayPal order approval
app.post('/execute-payment', async (req, res) => {
  const orderId = req.body.orderId; // Get order ID from the request body

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    const captureId = capture.result.purchase_units[0].payments.captures[0].id;
    // Handle post-payment process, e.g., store in DB, send confirmation email
    res.json({ status: 'success', captureId: captureId });
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Function to generate a unique ID for Redis keys
function generateUniqueId() {
  return crypto.randomBytes(16).toString('hex');
}

