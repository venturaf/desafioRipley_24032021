const bodyParser = require('body-parser');

const userRoute = require('./router/user');
const healthRoute = require('./router/health');
const balanaceRoute = require('./router/balance');
const historyRoute = require('./router/history');

const { PORT } = process.env;

module.exports = (express,repository) => {
    const app = express();
    const router = express.Router();

    var express = require('express')
    var cors = require('cors')
    var app = express()
    
    app.use(cors())

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use("/health", healthRoute(router));
    app.use("/user", userRoute(router,repository));
    app.use("/balance", balanaceRoute(router,repository));
    app.use("/history", historyRoute(router,repository));

    app.listen(PORT, () => {
        console.log(`server running at http://localhost:${PORT}`)
    });
}