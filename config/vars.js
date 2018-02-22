module.exports = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    mongo: process.env.MONGO_URI || 'mongodb://root:root@ds245518.mlab.com:45518/node-starter'
};
