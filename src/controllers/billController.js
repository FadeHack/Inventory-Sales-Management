const Bill = require('../models/Bill');
const InventoryItem = require('../models/InventoryItem');

// Create a bill
exports.createBill = async (req, res) => {
    try {
        const { items } = req.body;
        let totalAmount = 0;

        const updatedItems = [];

        for (const item of items) {
            const inventoryItem = await InventoryItem.findById(item.item);
            if (!inventoryItem || inventoryItem.quantity < parseInt(item.quantity)) {
                return res.status(400).json({ error: 'Invalid item or insufficient stock' });
            }

            // Calculate totalAmount
            const price = inventoryItem.price;  // Retrieve price from inventory item
            totalAmount += price * parseInt(item.quantity);

            // Update inventory stock
            inventoryItem.quantity -= parseInt(item.quantity);
            await inventoryItem.save();

            // Add item with price to the array
            updatedItems.push({
                item: inventoryItem._id,
                quantity: parseInt(item.quantity),
                price: price
            });
        }

        const newBill = new Bill({ items: updatedItems, totalAmount });
        await newBill.save();
        res.status(201).json(newBill);
    } catch (error) {
        console.error('Error creating bill:', error);
        console.log('Request body:', req.body);
        res.status(500).json({ error: error.message });
    }
};


// Get all bills
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().populate({
            path: 'items.item',
            select: 'name'  // Include the name of the item in the populated data
        });

        // Format the response to include item names
        const formattedBills = bills.map(bill => ({
            ...bill.toObject(),
            items: bill.items.map(item => ({
                ...item.toObject(),
                item: {
                    ...item.item.toObject(),
                    name: item.item.name
                }
            }))
        }));

        res.status(200).json(formattedBills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a specific bill by ID
exports.getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id).populate({
            path: 'items.item',
            select: 'name'  // Include the name of the item in the populated data
        });

        if (!bill) return res.status(404).json({ error: 'Bill not found' });

        // Format the response to include item names
        const formattedBill = {
            ...bill.toObject(),
            items: bill.items.map(item => ({
                ...item.toObject(),
                item: {
                    ...item.item.toObject(),
                    name: item.item.name
                }
            }))
        };

        res.status(200).json(formattedBill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

