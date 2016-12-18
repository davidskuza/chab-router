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
    name: '',
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
      
      routeObject.name = route.name
      
      break
    }
  }
  
  return routeObject
}

export const buildUrl = function(route, data) {
  const urlParamsNames = getDynamicParamsNames(route.path)
  
  let finalUrl = route.path
  
  for (const paramName of urlParamsNames) {
    finalUrl = finalUrl.replace(`{${paramName}}`, data.params[paramName])
  }
  
  if (data.query) {
    finalUrl += '?'
    
    finalUrl += Object.keys(data.query)
      .map(x => `${encodeURIComponent(x)}=${encodeURIComponent(data.query[x])}`)
      .join('&')
  }
  
  if (data.hash) {
    finalUrl += `#${data.hash}`
  }
  
  return finalUrl
}

export const CreateRouter = function(chab, id) {
  if (!id) {
    id = ''
  } else {
    id = `.${id}`
  }

  const baseTopicName = `router${id}`
  let routes = []
  let beforeHooks = []

  let onPopStateFunction = null
  
  function callBeforeHooks() {
    for (const beforeHook of beforeHooks) {
      if (!beforeHook()) {
        return false // if somebody returned false, it means stop, don't navigate
      }
    }
    
    return true
  }
  
  function subscribeAll(locationObject, historyObject) {
    const initializeSub = chab.subscribe(`${baseTopicName}.initialize`, function() {
      onPopStateFunction = function(e) {
        if (callBeforeHooks()) {
          chab.publish(`${baseTopicName}.navigated`, 
            matchRoute(routes, locationObject))
        }
      }
      window.removeEventListener('popstate', onPopStateFunction)
      window.addEventListener('popstate', onPopStateFunction)

      const currentRoute = matchRoute(routes, locationObject)

      if (!currentRoute.notFound) {
        if (callBeforeHooks()) {
          chab.publish(`${baseTopicName}.navigated`, currentRoute)
        }
      } else {
        chab.publish(`${baseTopicName}.navigated.notFound`, currentRoute)
      }
    })
    
    chab.subscribe(`${baseTopicName}.beforeHook.add`, function(data) {
      beforeHooks.push(data)
    })
    
    chab.subscribe(`${baseTopicName}.beforeHook.remove`, function(data) {
      const index = beforeHooks.indexOf(data)
      if (index >= 0) {
        beforeHooks.splice(index, 1)
      }
    })

    const routesSetSub = chab.subscribe(`${baseTopicName}.routes.set`, function(data) {
      routes = data.routes

      chab.publish(`${baseTopicName}.initialize`)
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
      
      if (!callBeforeHooks()) {
        return
      }
      
      historyObject.pushState(null, null, targetUrl)
      
      chab.publish(`${baseTopicName}.navigated`, 
        matchRoute(routes, locationObject))
    })
    
    const goBackSub = chab.subscribe(`${baseTopicName}.go.back`, function() {
      historyObject.back()
    })
    
    const goForwardSub = chab.subscribe(`${baseTopicName}.go.forward`, function() {
      historyObject.forward()
    })
    
    const goBySub = chab.subscribe(`${baseTopicName}.go.by`, function(number) {
      historyObject.go(number)
    })
    
    const currentRouteSub = chab.subscribe(`${baseTopicName}.currentRoute.get`, 
      function() {
        chab.publish(`${baseTopicName}.currentRoute.value`, 
          matchRoute(routes, locationObject))
      })

    const terminateSub = chab.subscribe(`${baseTopicName}.terminate`, function() {
      window.removeEventListener('popstate', onPopStateFunction)

      goSub.unsubscribe()
      routesSetSub.unsubscribe()
      initializeSub.unsubscribe()
      currentRouteSub.unsubscribe()
      
      goBySub.unsubscribe()
      goForwardSub.unsubscribe()
      goBackSub.unsubscribe()
      
      terminateSub.unsubscribe()
    })
  }

  subscribeAll(location, history)
}