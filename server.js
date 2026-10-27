
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Initial food menu
let foods = [
  { id: 1, name: "Veg Burger", price: 120 },
  { id: 2, name: "Pizza", price: 250 },
  { id: 3, name: "Dosa", price: 60 }
];

// Store orders in memory
let orders = [];
let nextFoodId = 4;
let nextOrderId = 1;

// GET: Display all food items
app.get("/api/foods", (req, res) => {
  res.json(foods);
});

// POST: Add a new food item
app.post("/api/foods", (req, res) => {
  const { name, price } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isFinite(Number(price)) ||
    Number(price) <= 0
  ) {
    return res.status(400).json({
      error: "Enter a valid food name and price"
    });
  }

  const food = {
    id: nextFoodId++,
    name: name.trim(),
    price: Number(price)
  };

  foods.push(food);
  res.status(201).json(food);
});

// PUT: Update food details
app.put("/api/foods/:id", (req, res) => {
  const food = foods.find(
    f => f.id === Number(req.params.id)
  );

  if (!food) {
    return res.status(404).json({
      error: "Food item not found"
    });
  }

  const { name, price } = req.body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isFinite(Number(price)) ||
    Number(price) <= 0
  ) {
    return res.status(400).json({
      error: "Enter a valid food name and price"
    });
  }

  food.name = name.trim();
  food.price = Number(price);

  res.json(food);
});

// DELETE: Remove a food item
app.delete("/api/foods/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = foods.some(f => f.id === id);

  if (!exists) {
    return res.status(404).json({
      error: "Food item not found"
    });
  }

  foods = foods.filter(f => f.id !== id);

  res.json({
    message: "Food deleted successfully"
  });
});

// POST: Place a customer order
app.post("/api/orders", (req, res) => {
  const { customer, food, quantity } = req.body;

  if (
    typeof customer !== "string" ||
    !customer.trim() ||
    typeof food !== "string" ||
    !food.trim() ||
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) < 1
  ) {
    return res.status(400).json({
      error: "Enter valid customer, food and quantity details"
    });
  }

  const order = {
    id: nextOrderId++,
    customer: customer.trim(),
    food: food.trim(),
    quantity: Number(quantity),
    status: "Pending"
  };

  orders.push(order);

  res.status(201).json({
    message: "Order placed successfully",
    order: order
  });
});

// GET: Display all customer orders
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// PUT: Update customer order status
app.put("/api/orders/:id", (req, res) => {
  const order = orders.find(
    o => o.id === Number(req.params.id)
  );

  if (!order) {
    return res.status(404).json({
      error: "Order not found"
    });
  }

  const allowedStatuses = [
    "Pending",
    "Preparing",
    "Delivered",
    "Cancelled"
  ];

  const { status } = req.body;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid order status"
    });
  }

  order.status = status;

  res.json({
    message: "Order status updated successfully",
    order: order
  });
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
