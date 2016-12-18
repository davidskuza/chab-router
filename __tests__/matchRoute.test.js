import { matchRoute } from '../src'

test('matches correct url, home', function() {
  const routes = [
    {
      name: 'contact',
      path: '/contact'
    },
    {
      name: 'home',
      path: '/'
    }
  ]
  
  const locationObject = {
    pathname: '/',
    hash: '',
    search: ''
  }
  
  const route = matchRoute(routes, locationObject)
  
  expect(route.name).toBe('home')
  expect(route.notFound).toBe(false)
  expect(route.path).toBe('/')
})

test('matches correct url, contact', function() {
  const routes = [
    {
      name: 'contact',
      path: '/contact'
    },
    {
      name: 'home',
      path: '/'
    }
  ]
  
  const locationObject = {
    pathname: '/contact',
    hash: '',
    search: ''
  }
  
  const route = matchRoute(routes, locationObject)
  
  expect(route.name).toBe('contact')
  expect(route.notFound).toBe(false)
  expect(route.path).toBe('/contact')
})

test('not found ', function() {
  const routes = [
    {
      name: 'contact',
      path: '/contact'
    },
    {
      name: 'home',
      path: '/'
    }
  ]
  
  const locationObject = {
    pathname: '/about',
    hash: '',
    search: ''
  }
  
  const route = matchRoute(routes, locationObject)
  
  expect(route.notFound).toBe(true)
})

test('matches with dynamic params', function() {
  const routes = [
    {
      name: 'contact',
      path: '/contact'
    },
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'articleRead',
      path: '/article/{id}/{title}'
    }
  ]
  
  const locationObject = {
    pathname: '/article/421/hello-from-tests',
    hash: '',
    search: ''
  }
  
  const route = matchRoute(routes, locationObject)
  
  expect(route.name).toBe('articleRead')
  expect(route.notFound).toBe(false)
  expect(route.params.id).toBe('421')
  expect(route.params.title).toBe('hello-from-tests')
})

test('matches correct url with query and hash info', function() {
  const routes = [
    {
      name: 'contact',
      path: '/contact'
    },
    {
      name: 'home',
      path: '/'
    },
    {
      name: 'articleRead',
      path: '/article/{id}/{title}'
    }
  ]
  
  const locationObject = {
    pathname: '/',
    hash: '#test-data',
    search: '?firstItem=123a&second=test'
  }
  
  const route = matchRoute(routes, locationObject)
  
  expect(route.name).toBe('home')
  expect(route.notFound).toBe(false)
  expect(route.hash).toBe('test-data')
  expect(route.query.firstItem).toBe('123a')
  expect(route.query.second).toBe('test')
})