import * as supertest from 'supertest';
import { app } from '../App';

describe('Generic Tests', () => {
  it('Is API working', () =>
    supertest(app)
      .get('/status')
      .expect('Content-Type', /json/)
      .expect(200)
  )
})