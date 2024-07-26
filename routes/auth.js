var express = require('express');
var router = express.Router();
var db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../utils/helpers');

function validateRequest(requiredFields) {
    return function (req, res, next) {
        const missingFields = requiredFields.filter(field => !req?.body[field] || req?.body[field]?.trim() === '');
        if (missingFields?.length > 0) {
            res.statusMessage = `Missing required fields: ${missingFields.join(', ')}`;
            return res
                .status(400)
                .json({
                    missingFields: missingFields
                });
        }
        next();
    };
}

router.post('/register', validateRequest(['name', 'password']), async (req, res) => {

    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Registro de usuário',
            schema: { $ref: '#/definitions/register' }
        } */

    const { name, password, image } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await bcrypt.hash(name, 15);

    db.run('INSERT INTO users (id, name, password, profileImage) VALUES (?, ?, ?, ?)', [
        id,
        name,
        hashedPassword,
        image || null
    ], function (err) {
        if (err) {
            if (err.errno == 19) return res.status(400).json({ error: 'Já existe um usuário cadastrado com este email' })
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Usuário registrado com sucesso!' });
    });
});

router.post('/login', validateRequest(['name', 'password']), (req, res) => {

    /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Login',
            schema: { $ref: '#/definitions/login' }
        } */

    const { name, password } = req.body;

    db.get('SELECT * FROM users WHERE name = ?', [name], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '3h' });
        res.status(200).json({ message: 'Login successful', token, profileImage: user.profileImage });
    });
});

module.exports = router;