// backend/routes/service.js
const express = require('express');
const {
    createService,
    getServicesByCategory,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const router = express.Router();

// Create a service within a category
router.post('/category/:categoryId/service', createService);

// Get all services within a category
router.get('/category/:categoryId/services', getServicesByCategory);

// Update a service within a category
router.put('/category/:categoryId/service/:serviceId', updateService);

// Delete a service within a category
router.delete('/category/:categoryId/service/:serviceId', deleteService);

module.exports = router;
