import Banana from "../models/bananaModel.js";
import { createIdService } from "../services/createIdService.js";
import { verifyWord } from "../services/verifyWordService.js";
import { getDate, getTime } from "../services/getDateService.js";
import { sendDataBananas } from "../services/sendDataService.js";
import { classifyColor } from "../services/classifyColorService.js";

export const registerBanana = async (req, res) => {
    const data = req.body;

    if (!verifyWord(data.color)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid color",
            error: "The color must not contain special characters",
        });
    }

    try {
        const classification = await classifyColor(data.color);
        const id = await createIdService();
        const date = await getDate();
        const time = await getTime();

        const newBanana = {
            id: id,
            date: date,
            time: time,
            color: data.color,
            classification: classification,
        };

        await Banana.create(newBanana);
        await sendDataBananas(newBanana);

        res.status(201).json({
            status: "success",
            data: {
                date: newBanana.date,
                time: newBanana.time,
                color: newBanana.color,
                classification: newBanana.classification,
            },
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({
                status: "error",
                message: "Invalid data",
                error: error.message,
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "An error has occurred while creating the register",
                error: error.message,
            });
        }
    }
};

export const findAllClassification = async (req, res) => {
    try {
        const bananas = await Banana.findAll();

        if (!bananas || bananas.length === 0) {
            res.status(204).json({
                status: "error",
                message: "Data not found",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: bananas,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "An error has occurred while processing the request",
            error: error.message,
        });
    }
};