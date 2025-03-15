const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models/users.model');

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    //check if email already exists
    Users.getByEmail(email, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving User."
            });
        } else {
            if (data.length > 0) {
                res.status(409).send({
                    message: "Email already exists."
                });
            } else {
                const newUser = new Users(null, name, email, bcrypt.hashSync(password, 8));

                Users.create(newUser, (err, data) => {
                    if (err) {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the User."
                        });
                    } else {
                        res.status(201).send({message: "User sucessfully created." });
                    }
                });
            }
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    Users.getByEmail(email, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving User."
            });
        } else {
            if (data.length === 0) {
                res.status(401).send({
                    message: "Invalid email or password."
                });
            } else {
                const isValid = bcrypt.compareSync(password, data[0].password);
                if (!isValid) {
                    res.status(401).send({
                        message: "Invalid email or password."
                    });
                } else {
                    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, {
                        expiresIn: 86400 // 24 hours
                    });
                    res.status(200).send({message: "User sucessfully connected", token: token });
                }
            }
        }
    });
};
