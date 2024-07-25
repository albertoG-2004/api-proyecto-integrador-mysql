import { DataTypes } from 'sequelize';
import sequelize from '../connection/connection.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 50,
        },
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 25,
        },
    },
    sur_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 25,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            max: 50,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: 8,
            max: 150,
        },
    },
}, {
    timestamps: false,
});

export default User;