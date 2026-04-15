// .env betöltése
require('dotenv').config();

// Core csomagok
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Security csomagok
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// App
const app = express();

// MONGODB kapcsolodás
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('DB hiba:', err));


// SECURITY MIDDLEWARE

// HTTP headers security
app.use(helmet());

// Body limit (extra védelem)
app.use(express.json({ limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// NoSQL injection védelem
app.use(mongoSanitize());

// XSS védelem
app.use(xss());

// HTTP param pollution védelem
app.use(hpp());


// CORS
app.use(cors());


// RATE LIMIT (API védelem)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        msg: "Túl sok kérés, próbáld később!"
    }
});

app.use('/api', limiter);


// Controllers
const routes = require('./controllers');
app.use('/api', routes);


// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// 404 kezelő / nem található útvonal
app.use((req, res) => {
    res.status(404).json({
        success: false,
        msg: "Nincs ilyen végpont!"
    });
});


// Globális hibakezelő
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        msg: err.message || "Szerver hiba"
    });
});


// Szerver inditás
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Szerver fut / Swagger: http://localhost:${PORT}/api-docs`);
});