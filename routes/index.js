module.exports = app => {
  app.get("/", (req, res) => {
    res.status(200);
    res.json({
      'api': 'Node-Template',
      'status': 'OK'
    });
  });
};
