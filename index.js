const { port, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongoose');

mongoose.connect();

app.listen(port, () => console.info(`server started on port ${port} (${env})`));

module.exports = app;
