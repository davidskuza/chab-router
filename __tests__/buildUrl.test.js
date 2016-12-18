import { buildUrl } from '../src'

test('creates correct url, static', function() {
  const route = {
    name: 'contact',
    path: '/contact'
  }
  
  const data = {
    name: 'contact'
  }
  
  const url = buildUrl(route, data)
  
  expect(url).toBe('/contact')
})

test('creates correct url, with hash and query data', function() {
  const route = {
    name: 'contact',
    path: '/contact'
  }
  
  const data = {
    name: 'contact',
    hash: 'contact-form',
    query: {
      from: 'homePage'
    }
  }
  
  const url = buildUrl(route, data)
  
  expect(url).toBe('/contact?from=homePage#contact-form')
})

test('matches correct url, dynamic params', function() {
  const route = {
    name: 'articleRead',
    path: '/article/{id}/{title}'
  }
  
  const data = {
    name: 'contact',
    params: {
      id: 142,
      title: 'example-article'
    }
  }
  
  const url = buildUrl(route, data)
  
  expect(url).toBe('/article/142/example-article')
})

test('matches correct url, dynamic params with hash and query', function() {
  const route = {
    name: 'articleRead',
    path: '/article/{id}/{title}'
  }
  
  const data = {
    name: 'contact',
    params: {
      id: 142,
      title: 'example-article'
    },
    hash: 'hello',
    query: {
      test: 'asdasd'
    }
  }
  
  const url = buildUrl(route, data)
  
  expect(url).toBe('/article/142/example-article?test=asdasd#hello')
})