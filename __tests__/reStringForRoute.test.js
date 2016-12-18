import { getReStringForRoute } from '../src'

test('returns correct re for static route', function() {
  const route = {
    path: '/contact'
  }
  
  const reString = getReStringForRoute(route, [])
  
  expect(reString).toBe('^/contact$')
})

test('returns correct re for route with dynamic params (no custom rules speficied)',
  function() {
    const route = {
      path: '/article/{id}/{title}'
    }
    
    const reString = getReStringForRoute(route, ['id', 'title'])
    
    expect(reString).toBe('^/article/(.+?)/(.+?)$')
  })
  
test('returns correct re for route with custom rules', function() {
  const route = {
    path: '/article/{id}/{title}',
    where: {
      id: '([0-9]{1,3})',
      title: '([a-z]+)'
    }
  }
  
  const reString = getReStringForRoute(route, ['id', 'title'])
  
  expect(reString).toBe('^/article/([0-9]{1,3})/([a-z]+)$')
})