import Monitoring from "../models/monitoringModel.js";
import { createIdService } from "../services/createIdService.js";
import { verifyWord } from "../services/verifyWordService.js";
import { getDate, getTime } from "../services/getDateService.js";
import { sendDataMonitorings } from "../services/sendDataService.js";

export const registerMonitoring = async (req, res) => {
    const data = req.body;

    if (!verifyWord(data.box)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid box",
            error: "The box must not contain special characters",
        });
    }

    try {

        const id = await createIdService();
        const temp = Number(data.temperature);
        const humi = Number(data.humidity);
        const weight = Number(data.weight);
        const date = await getDate();
        const time = await getTime();

        const newMonitoring = {
            id: id,
            box: data.box,
            date: date,
            time: time,
            temperature: temp,
            humidity: humi,
            weight: weight,
        };

        await Monitoring.create(newMonitoring);
        await sendDataMonitorings(newMonitoring);

        res.status(201).json({
            status: "success",
            data: {
                box: newMonitoring.box,
                date: newMonitoring.date,
                time: newMonitoring.time,
                temperature: newMonitoring.temperature,
                humidity: newMonitoring.humidity,
                weight: newMonitoring.weight,
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

export const findAllByDate = async (req, res) => {
    const date = req.params.date;

    try {

        const monitorings = await Monitoring.findAll({
            where: {
                date: date,
            },
        });

        if (!monitorings || monitorings.length === 0) {
            res.status(204).json({
                status: "success",
                message: "Data not found by condition",
            });
        } else {
            res.status(200).json({
                status: "success",
                data: monitorings,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "An error has occurred while processing the request",
            error: error.message,
        });
    }
};