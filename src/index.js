export const parseQueryString = function(query) {
  const params = {}

  for (const param of query.split('&').map(x => x.split('='))) {
    const key = param[0]
    const value = param[1]

    if (params[key]) {
      // if key was present before, change to array and add new item
      params[key] = [params[key]]
      params[key].push(value)
    } else {
      params[key] = value
    }
  }

  return params
}

export const getDynamicParamsNames = function(path) {
  const paramsNames = []
  const paramsNamesRe = /\{(.+?)\}/g
  
  let match = null
  while (match = paramsNamesRe.exec(path)) {
    paramsNames.push(match[1])
  }
  
  return paramsNames
}

export const getReStringForRoute = function(route, paramsNames) {
  let finalPathRe = route.path

  for (const paramName of paramsNames) {
    let re = '(.+?)'

    if (route.where && route.where[paramName]) {
      re = route.where[paramName]
    }

    finalPathRe = finalPathRe.replace(`{${paramName}}`, re)
  }
  
  return `^${finalPathRe}$`
}

export const getDynamicParamsValues = function(path, paramsReString) {
  const paramsRe = new RegExp(paramsReString)
  const paramsValues = []
  
  if (paramsRe.test(path)) {
    const paramsMatch = paramsRe.exec(path)
    
    for (let i = 1; i < paramsMatch.length; ++i) {
      paramsValues.push(paramsMatch[i])
    }
  }
  
  return paramsValues
}

export const createObjectFromArrays = function(keysArray, valuesArray) {
  const object = {}
  
  for (let i = 0; i < keysArray.length; ++i) {
    object[keysArray[i]] = valuesArray[i]
  }
  
  return object
}

export const matchesUrl = function(path, pathReString) {
  return new RegExp(pathReString).test(path)
}

export const getRouteObject = function(locationObject) {
  return {
    path: locationObject.pathname,
    params: [],
    hash: 
      locationObject.hash.length > 0
        ? locationObject.hash.substring(1)
        : '',
    query: 
        locationObject.search.length > 0 
          ? parseQueryString(locationObject.search.substring(1))
          : {},
    notFound: true
  }
}

export const matchRoute = function(routes, locationObject) {
  const routeObject = getRouteObject(locationObject)
  
  for (const route of routes) {
    const paramsNames = getDynamicParamsNames(route.path)
    const finalPathRe = getReStringForRoute(route, paramsNames)
    
    if (matchesUrl(locationObject.pathname, finalPathRe)) {
      routeObject.notFound = false
      
      const paramsValues = getDynamicParamsValues(
        locationObject.pathname, finalPathRe)
        
      routeObject.params = createObjectFromArrays(paramsNames, paramsValues)
      
      break
    }
  }
  
  return routeObject
}

export const CreateRouter = function(chab, id) {
  if (!id) {
    id = ''
  } else {
    id = `.${id}`
  }

  const baseTopicName = `router${id}`
  let routes = []
  
  function buildUrl(route, data) {
    const urlParamsNames = getDynamicParamsNames(route.path)
  }
  
  function subscribes() {
    const initializeSub = chab.subscribe(`${baseTopicName}.initialize`, function() {
      const currentRoute = matchRoute(routes, location)

      if (!currentRoute.notFound) {
        chab.publish(`${baseTopicName}.go`, currentRoute)
      } else {
        chab.publish(`${baseTopicName}.navigated.notFound`, currentRoute)
      }
    })

    const routesSetSub = chab.subscribe(`${baseTopicName}.routes.set`, function(data) {
      routes = data.routes

      chab.publish(`${baseTopicName}.init`)
    })

    const goSub = chab.subscribe(`${baseTopicName}.go`, function(data) {
      if (!data.name) {
        return
      }
      
      const route = routes.find(x => x.name === data.name)
      
      if (!route) {
        return
      }
      
      const targetUrl = buildUrl(route, data)
      
      // TODO: change url
      // TODO: publish
      
      // data.name
      // data.params
      // data.query
      // data.hash

      // TODO: do it
      
      //chab.publish(`${baseTopicName}.navigated`, data)
    })

    const terminateSub = chab.subscribe(`${baseTopicName}.terminate`, function() {
      goSub.unsubscribe()
      routesSetSub.unsubscribe()
      initializeSub.unsubscribe()
      terminateSub.unsubscribe()
    })
  }

  subscribes()
}