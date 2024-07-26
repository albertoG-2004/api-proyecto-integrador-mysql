import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import pkg from "signale";
import helmet from "helmet";
import routesUser from './src/routes/userRoute.js';
import routesBanana from "./src/routes/bananaRoute.js";
import routesMonitoring from "./src/routes/monitoringRoute.js";
import { connectToDatabase, sequelize } from './src/connection/connection.js';
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;

const app = express();
const { Signale } = pkg;
const sigOptions = {
    secrets: ["([0-9]{4}-?)+"]
};
const signale = new Signale(sigOptions);

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(helmet.hidePoweredBy());


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    keyGenerator: (req, res) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      return ip ? ip.toString() : 'default';
    }
});

app.use(limiter);
app.use("/users", routesUser);
app.use("/bananas", routesBanana);
app.use("/monitorings", routesMonitoring);

const startServer = async () => {
    await connectToDatabase();
    await sequelize.sync({ force: true });
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });
};

startServer();