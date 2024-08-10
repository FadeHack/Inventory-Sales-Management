const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
    items: [billItemSchema],
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bill', billSchema);
