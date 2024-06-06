// backend/controllers/serviceController.js
const pool = require('../models/db');

// Create a service
const createService = (req, res) => {
    const { categoryId } = req.params;
    const { name, type, priceOptions } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'INSERT INTO services (category_id, name, type) VALUES (?, ?, ?)';
        connection.query(query, [categoryId, name, type], async (err, result) => {
            connection.release();

            if (err) {
                console.error('Error creating service:', err);
                return res.status(500).json({ message: 'Failed to create service' });
            }

            const serviceId = result.insertId;
            try {
                await savePriceOptions(serviceId, priceOptions);
                res.json({ id: serviceId, name, type, priceOptions });
            } catch (error) {
                console.error('Error saving price options:', error);
                return res.status(500).json({ message: 'Failed to save price options for service' });
            }
        });
    });
};

// Helper function to save price options for a service
const savePriceOptions = async (serviceId, priceOptions) => {
    const values = priceOptions.map(option => [serviceId, option.duration, option.price, option.type]);

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'INSERT INTO service_price_options (service_id, duration, price, type) VALUES ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [values], (err) => {
                connection.release();

                if (err) {
                    console.error('Error saving price options:', err);
                    reject(err);
                }
                resolve();
            });
        });
    });
};

// Get all services in a category
const getServicesByCategory = (req, res) => {
    const { categoryId } = req.params;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        const query = 'SELECT * FROM services WHERE category_id = ?';
        connection.query(query, [categoryId], (err, results) => {
            connection.release();
            if (err) {
                console.error('Error fetching services:', err);
                return res.status(500).json({ message: 'Failed to fetch services' });
            }
            res.json(results);
        });
    });
};

// Update a service
const updateService = (req, res) => {
    const { categoryId, serviceId } = req.params;
    const { name, type, priceOptions } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const updateServiceQuery = 'UPDATE services SET name = ?, type = ? WHERE id = ?';
        connection.query(updateServiceQuery, [name, type, serviceId], async (err) => {
            connection.release();

            if (err) {
                console.error('Error updating service:', err);
                return res.status(500).json({ message: 'Failed to update service' });
            }

            try {
                await deletePriceOptions(serviceId);
                await savePriceOptions(serviceId, priceOptions);
                res.json({ id: serviceId, name, type, priceOptions });
            } catch (error) {
                console.error('Error updating price options:', error);
                return res.status(500).json({ message: 'Failed to update price options for service' });
            }
        });
    });
};

// Helper function to delete price options for a service
const deletePriceOptions = (serviceId) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'DELETE FROM service_price_options WHERE service_id = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [serviceId], (err) => {
                connection.release();

                if (err) {
                    console.error('Error deleting price options:', err);
                    reject(err);
                }
                resolve();
            });
        });
    });
};

// Delete a service
const deleteService = (req, res) => {
    const { categoryId, serviceId } = req.params;

    pool.getConnection((err, connection) => {
        if(err) throw err;
        const deleteServiceQuery = 'DELETE FROM services WHERE id = ?';
        connection.query(deleteServiceQuery, [serviceId], (err, result) => {
            connection.release();
            
            if (err) {
                console.error('Error deleting service:', err);
                return res.status(500).json({ message: 'Failed to delete service' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Service not found' });
            }
            res.json({ message: 'Service deleted' });
        });
    });
};

module.exports = { createService, getServicesByCategory, updateService, deleteService };
