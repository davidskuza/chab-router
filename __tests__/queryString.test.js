import { parseQueryString } from '../src'

test('few diffrent arguments', function() {
  const queryString = 'a=val&b=otherval&c=154fa&d=as6 as5a a'
  
  const parsed = parseQueryString(queryString)
  
  expect(parsed.a).toBe('val')
  expect(parsed.b).toBe('otherval')
  expect(parsed.c).toBe('154fa')
  expect(parsed.d).toBe('as6 as5a a')
})

test('array keys', function() {
    const queryString = 'a=val&arr=gas&arr=avsa'
    
    const parsed = parseQueryString(queryString)
    
    expect(parsed.a).toBe('val')
    expect(parsed.arr).toContain('gas')
    expect(parsed.arr).toContain('avsa')
})

test('weird key name', function() {
    const queryString = 'a[]=val&fsa^3a=asd'
    
    const parsed = parseQueryString(queryString)
    
    expect(parsed['a[]']).toBe('val')
    expect(parsed['fsa^3a']).toContain('asd')
})