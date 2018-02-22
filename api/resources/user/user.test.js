const { request } = require('../../../config/helpers')
const app = require('../index')
const User = require('./user.model');
const httpStatus = require('http-status');

const keys = ['id', 'name', 'email']

async function transform(user) {
    const formated = user

    delete formated._id
    delete formated.__v
    delete formated.createdAt
    delete formated.updatedAt
    delete formated.password

    return formated
}

before(async () => {
    seedUsers = {
        user1: {
            name: "Test user 1",
            email: "test1@test.com",
            password: "123456"
        },
        user2: {
            name: "Test user 2",
            email: "test2@test.com",
            password: "123456"
        },
        user4: {
            name: "Test user 4",
            email: "test4@test.com",
            password: "123456"
        }
    }

    newUser = {
        name: "Test user 3",
        email: "test3@test.com",
        password: "123456"
    }

    await User.remove({})
    await User.insertMany([seedUsers.user1, seedUsers.user2, seedUsers.user4])
});

describe('Routes: User', () => {
    describe('GET /user', () => {
        it('should return a list of users', (done) => {
            request
                .get('/user')
                .end(async (err, res) => {
                    expect(res.status).to.be.equal(httpStatus.OK)
                    
                    const user = await transform(res.body[0])

                    expect(res.body).to.be.an('array')
                    expect(user).to.have.all.keys(...keys)
                    expect( res.body.map(i => i.email) ).to.be.include(seedUsers.user2.email)

                    done(err);
                });
        });
    });

    describe('POST /user', () => {
        it('should create a user', done => {
            request.post('/user')
                .send(newUser)
                .end((err, res) => {
                    expect(res.status).to.be.equal(httpStatus.CREATED)
                    done(err);
                });
        });

        it('should not create a user when email already exists', done => {
            newUser.email = seedUsers.user1.email

            request.post('/user')
                .send(newUser)
                .end((err, res) => {
                    expect(res.status).to.be.equal(httpStatus.CONFLICT)

                    expect(res.error.text).to.include('Unique field validation Error')
                    
                    done(err)
                });
        });

        it('should not create a user when email is not provided', done => {
            delete newUser.email

            request.post('/user')
                .send(newUser)
                .end((err, res) => {
                    expect(res.status).to.be.equal(httpStatus.BAD_REQUEST)

                    expect(res.error.text).to.include('Required field not provided')

                    done(err)
                });
        });
    });

    describe('GET /user/:id', async () => {
        it('should get user', async () => {
            const id = (await User.findOne({}))._id;

            return request
                .get(`/user/${id}`)
                .then(res => {
                    expect(res.status).to.be.equal(httpStatus.OK)

                    expect(res.body.id).to.be.equal(id.toString())
                    expect(res.body.email).to.not.be.empty
                })
        });

        it('should return not found', done => {
            request
                .get(`/user/abc`)
                .end((err, res) => {
                    expect(res.status).to.be.equal(httpStatus.NOT_FOUND)

                    expect(res.body.message).to.be.equal('User does not exist')
                    expect(res.body.code).to.be.equal(httpStatus.NOT_FOUND)

                    done(err)
                })
        })
    });

    describe('DELETE /user/:id', () => {
        it('should delete a user', async () => {
            const id = (await User.findOne({}))._id

            return request
                .delete(`/user/${id}`)
                .then((res) => {
                    expect(res.status).to.be.equal(httpStatus.NO_CONTENT)

                    request
                        .get('/user')
                        .then((res) => {
                            expect(res.body.map(x => x.id)).to.not.contain(id)
                        })
                })
        })

        it('should not delete a user that does not exist', async () => {
            const id = (await User.findOne({}))._id

            return request
                .delete(`/user/${id}`)
                .end((err, res) => {
                    request
                        .delete(`/user/${id}`)
                        .then(res => {
                            expect(res.status).to.be.equal(httpStatus.NOT_FOUND)
                        })
                })
        })

        it('should return bad request when a invalid id is sent', done => {
            request
                .delete('/user/abc')
                .end((err, res) => {
                    expect(res.status).to.be.equal(httpStatus.BAD_REQUEST)

                    expect(res.body.message).to.be.equal('Invalid data sent')

                    done(err)
                })
        })
    });

    describe('PATCH /user/:id', () => {
        it('should update some fields of a specific user', async () => {
            const id = (await User.findOne({}))._id

            newUser.email = 'newEmail@test.com'

            return request
                .patch(`/user/${id}`)
                .send(newUser)
                .then((res) => {
                    expect(res.status).to.be.equal(httpStatus.OK)

                    expect(res.body.email).to.be.equal('newEmail@test.com')
                })
        })

        it('should not update a user due to duplicated email', async () => {
            const id = (await User.findOne({}))._id

            newUser.email = seedUsers.user4.email

            request.get('/user').then(res => newUser.email = res.body[0].email)

            return request.get('/user')
                .then(res => {
                    newUser.email = res.body[0].email
                    
                    request
                        .patch(`/user/${id}`)
                        .send(newUser)
                        .then((res) => {
                            expect(res.status).to.be.equal(httpStatus.CONFLICT)
                        })
                })
        })
    });
});
