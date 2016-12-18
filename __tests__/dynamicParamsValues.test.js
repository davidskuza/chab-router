import { getDynamicParamsValues } from '../src'

test('returns empty array for static path', function() {
  const path = '/contact'
  const re = '^/contact$'
  
  const paramsValues = getDynamicParamsValues(path, re)
  
  expect(paramsValues.length).toBe(0)
})

test('returns correct values', function() {
    const path = '/article/131/test-path'
    const re = '^/article/(.+?)/(.+?)$'
    
    const paramsValues = getDynamicParamsValues(path, re)
    
    expect(paramsValues.length).toBe(2)
    expect(paramsValues[0]).toBe('131')
    expect(paramsValues[1]).toBe('test-path')
})