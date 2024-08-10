const express = require('express');
const { addItem, getAllItems } = require('../controllers/inventoryController');

const router = express.Router();

router.post('/inventory', addItem);
router.get('/inventory', getAllItems);

module.exports = router;
