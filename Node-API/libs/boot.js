module.exports = app => {
    app.listen(app.get("port"), () => {
        console.log(`Node-Template API - port ${app.get("port")}`);
    });
};
