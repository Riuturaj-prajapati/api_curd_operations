// backend/controllers/categoryController.js
const pool = require('../models/db');

const createCategory = (req, res) => {
    const { name } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'INSERT INTO categories (name) VALUES (?)';
        connection.query(query, [name], (err, result) => {
            connection.release();

            if (err) throw err;

            res.json({ id: result.insertId, name });
        });
    })
};

const getCategories = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'SELECT * FROM categories';
        connection.query(query, (err, results) => {
            connection.release();

            if (err) throw err;

            res.json(results);
        });
    });
};

const updateCategory = (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;
    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = 'UPDATE categories SET name = ? WHERE id = ?';
        connection.query(query, [name, categoryId], (err) => {
            connection.release();

            if (err) throw err;

            res.json({ id: categoryId, name });
        });
    })
};

const deleteCategory = (req, res) => {
    const { categoryId } = req.params;

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const query = `DELETE FROM categories WHERE id = ? AND NOT EXISTS (SELECT 1 FROM services WHERE category_id = ?)`;
        db.query(query, [categoryId, categoryId], (err, result) => {
            connection.release();
            
            if (err) throw err;
            if (result.affectedRows === 0) {
                res.status(400).json({ message: 'Category not empty or not found' });
            } else {
                res.json({ message: 'Category deleted' });
            }
        });
    })
};

module.exports = { createCategory, getCategories, updateCategory, deleteCategory };
