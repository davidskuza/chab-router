import { getDynamicParamsNames } from '../src'

test('returns empty array when no dynamic params in path', function() {
  const path = '/contact'
  
  const paramsNames = getDynamicParamsNames(path)
  
  expect(paramsNames.length).toBe(0)
})

test('returns correct names for dynamic params', function() {
  const path = '/test/{id}/{title}/{seo-desc}/{cC}'
  
  const paramsNames = getDynamicParamsNames(path)
  
  expect(paramsNames.length).toBe(4)
  expect(paramsNames).toContain('id')
  expect(paramsNames).toContain('title')
  expect(paramsNames).toContain('seo-desc')
  expect(paramsNames).toContain('cC')
})