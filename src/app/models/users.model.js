const db = require("../config/db");

class Users {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static getAll(result) {
        const query = "SELECT * FROM users";
        db.query(query, result);
    }

    static getById(id, result) {
        const query = "SELECT * FROM users WHERE id = ?";
        db.query(query, id, result);
    }

    static getByEmail(email, result) {
        const query = "SELECT * FROM users WHERE email = ?";
        db.query(query, email, result);
    }

    static create(newUser, result) {
        const query = "INSERT INTO users SET ?";
        db.query(query, newUser, result);
    }

    static updateById(id, user, result) {
        const query = "UPDATE users SET ? WHERE id = ?";
        db.query(query, [user, id], result);
    }

    static deleteById(id, result) {
        const query = "DELETE FROM users WHERE id = ?";
        db.query(query, id, result);
    }
}

module.exports = Users;