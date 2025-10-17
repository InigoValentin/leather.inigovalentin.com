const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");

dotenv.config({ path: `environment/env.${process.env.ENV}`});

const app = express();

app.use(helmet());
app.use(compression());
//app.use(rateLimit({windowMs: 60*1000, max: 30}));

app.use(require("./routers/router.js"));

const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3000";
app.listen(port, () => {console.log("Server started on " + host + ":" + port);});
