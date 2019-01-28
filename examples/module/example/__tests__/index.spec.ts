import * as chai from 'chai'
import * as mocha from 'mocha'
import { add } from '../src/index'

const expect = chai.expect

describe('Mock test', () => {
  it('Should add numbers together', () => {
    const mockString = 'mock'
    expect(add(2, 2)).to.equal(4)
  })
})