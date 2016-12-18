import { createObjectFromArrays } from '../src'

test('returns empty object from arrays with no values', function() {
    const keysArray = []
    const valuesArray = []
    
    const obj = createObjectFromArrays(keysArray, valuesArray)
    
    expect(typeof obj).toBe('object')
})

test('returns correct object', function() {
  const keysArray = ['test', 'one', 'two']
  const valuesArray = ['value1', 'nextvalue', 'hello!']
    
  const obj = createObjectFromArrays(keysArray, valuesArray)
    
  expect(obj.test).toBe('value1')
  expect(obj.one).toBe('nextvalue')
  expect(obj.two).toBe('hello!')
})