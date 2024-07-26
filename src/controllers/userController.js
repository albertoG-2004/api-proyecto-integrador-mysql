import User from '../models/userModel.js';
import { createIdService } from '../services/createIdService.js';
import { verifyPhone } from '../services/verifyPhoneService.js';
import { verifyWord } from '../services/verifyWordService.js';
import { verifyEmail } from '../services/verifyEmailService.js';
import { verifyPassword } from '../services/verifyPasswordService.js';
import { encryptPassword, authPassword } from '../services/encryptPasswordService.js';

export const registerUser = async (req, res) => {
    const data = req.body;

    if (!verifyWord(data.name)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid name",
            error: "The name must not contain special characters, only accents",
        });
    }
    if (!verifyWord(data.last_name)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid last name",
            error: "The last name must not contain special characters, only accents",
        });
    }
    if (!verifyWord(data.sur_name)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid sur name",
            error: "The sur name must not contain special characters, only accents",
        });
    }
    if (!verifyPhone(data.phone_number)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid cellphone number",
            error: "The cellphone number must be a 10-digit number not starting with 0",
        });
    }
    if (!verifyEmail(data.email)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid email",
            error: "It must have the structure example@gmail.com",
        });
    }
    if (!verifyPassword(data.password)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid password",
            error: "Must contain at least 8 characters",
        });
    }

    try {
        const auxId = await createIdService();
        const pass = await encryptPassword(data.password);

        const newUser = {
            id: auxId,
            name: data.name,
            last_name: data.last_name,
            sur_name: data.sur_name,
            phone_number: data.phone_number,
            email: data.email,
            password: pass,
        };

        await User.create(newUser);

        res.status(201).json({
            status: "success",
            data: {
                name: newUser.name,
                last_name: newUser.last_name,
                sur_name: newUser.sur_name,
                phone_number: newUser.phone_number,
                email: newUser.email,
                password: newUser.password,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error has occurred while registering the user",
            error: error.message,
        });
        console.log("Error: ", error);
    }
};

export const findUser = async (req, res) => {
    const { phone_number, password } = req.params;

    try {

        const userFound = await User.findOne({
            where: {
                phone_number: phone_number,
            },
        });

        if (!userFound) {
            return res.status(404).json({
                status: "error",
                data: {
                    message: "User not found!",
                },
            });
        }

        if (await authPassword(password, userFound.password)) {
            return res.status(200).json({
                status: "success",
                data: {
                    message: "User found",
                },
            });
        } else {
            return res.status(400).json({
                status: "error",
                data: {
                    message: "Password incorrect!",
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error has occurred while processing the request",
            error: error.message,
        });
        console.log("Error: ", error);
    }
};

export const updateUser = async (req, res) => {
    const data = req.body;

    if (!verifyPhone(data.phone_number)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid cellphone number",
            error: "The cellphone number must be a 10-digit number not starting with 0",
        });
    }
    if (!verifyPassword(data.password)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid password",
            error: "Must contain at least 8 characters",
        });
    }

    try {
        const pass = await encryptPassword(data.password);
        const [updated] = await User.update(
            { password: pass },
            {
                where: {
                    phone_number: data.phone_number,
                },
            }
        );

        if (updated) {
            return res.status(200).json({
                status: "success",
                message: "User password updated successfully",
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "User not found or no changes made",
                error: "No user found with the provided phone number or the password is the same as the current one",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error has occurred while updating the user",
            error: error.message,
        });
        console.log("Error: ", error);
    }
};