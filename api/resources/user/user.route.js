const express = require('express');
const httpStatus = require('http-status');
const User = require('./user.model');
const { handler: errorHandler, mongoErrorHandler } = require('../../middlewares/error');

const router = express.Router();

router
    .route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.list();
            const transformedUsers = users.map(user => user.transform());
            res.json(transformedUsers);
        } catch (error) {
            next(error);
        }
    })
    .post(async (req, res, next) => {
        try {
            const user = new User(req.body);
            const savedUser = await user.save();
            res.status(httpStatus.CREATED);
            res.json(savedUser.transform());

        } catch (error) {
            next(mongoErrorHandler(error));
        }
    })

router
    .route('/:id')
    .get(async (req, res, next) => {
        try {
            const id = req.params.id
            const user = await User.get(id);
            res.json(user.transform());
        } catch (error) {
            return errorHandler(error, req, res);
        }
    })
    .patch(async (req, res, next) => {
        try {
            const id = req.params.id;
            await User.update(id, req.body);
            res.status(httpStatus.OK)
            res.json(req.body)
        } catch (error) {
            next(mongoErrorHandler(error))
        }
    })
    .delete(async (req, res, next) => {
        try {
            const id = req.params.id
            await User.delete(id)
            res.status(httpStatus.NO_CONTENT)
            res.json({
                message: `User ${id} deleted with success`
            })
        } catch (error) {
            return errorHandler(error, req, res)
        }
    })

module.exports = router;
