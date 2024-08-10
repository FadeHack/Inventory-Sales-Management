const express = require('express');
const { createBill, getAllBills, getBillById } = require('../controllers/billController');

const router = express.Router();

router.post('/bills', createBill);
router.get('/bills', getAllBills);
router.get('/bills/:id', getBillById);

module.exports = router;
