const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const APIError = require('../../utils/APIError');
const { env } = require('../../../config/vars');
const { mongoErrorHandler } = require('../../middlewares/error')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    }
}, {
        timestamps: true
    });


userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next();

        const rounds = env === 'dev' ? 1 : 10;

        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'email', 'createdAt'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    },
});

userSchema.statics = {

    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError({
                message: 'User does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list() {
        return this.find()
            .sort({ createdAt: -1 })
            .exec();
    },

    async update(id, user) {
        await this
            .findByIdAndUpdate(id, {
                $set: {
                    email: user.email,
                    password: user.password
                }
            });
    },

    async delete(id) {
        try {
            await this.findByIdAndRemove(id);
        } catch(error) {
            throw mongoErrorHandler(error)
        }
    }
};

module.exports = mongoose.model('User', userSchema);
