const InventoryItem = require('../models/InventoryItem');

// Add new item to inventory
exports.addItem = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;

        // Convert quantity and price to numbers
        const newQuantity = parseInt(quantity, 10); // Use parseInt for integers
        const newPrice = parseFloat(price);       // Use parseFloat for decimals

        const newItem = new InventoryItem({
            name,
            quantity: newQuantity,
            price: newPrice
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.log(req.body)
        // console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// Get all items from inventory
exports.getAllItems = async (req, res) => {
    try {
        const items = await InventoryItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
