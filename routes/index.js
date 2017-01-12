module.exports = app => {
  app.get("/", (req, res) => {
    res.status(200);
    res.json({
      'api': 'Node-Starter',
      'status': 'OK'
    });
  });
};
