const express = require('express');
const userRoutes = require('./user/user.route')

const router = express.Router()

router.get('/status', (req, res) => {
    res.status(200)
    res.json("It's on")
})

router.use('/user', userRoutes)

module.exports = router
