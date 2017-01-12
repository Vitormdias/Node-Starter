module.exports = app => {
    app.listen(app.get("port"), () => {
        console.log(`Node-Starter API - port ${app.get("port")}`);
    });
};
