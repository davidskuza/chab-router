# Chab Router

### Subscribes for

> router[.id].initialize

  Call when you want to router start playing.
  It will check current path, match route and fire events.
  
  **It will be called by ruoter[.id].routes.set**

> router[.id].routes.set

  Set routes you want this router to handle.
  
  Example object:
  ```js
    const routes = [
      {
        name: 'home',
        path: '/'
      },
      {
        name: 'contact',
        path: '/contact'
      },
      {
        name: 'withParams',
        path: '/subpage/{id}/{title}',
        where: {
          id: '(\d+)'
        }
      }
    ]
  ```
  
> router[.id].beforeHook.add
  
  Add function which will be called each time route tries to change.
  Return *true* if should go forward or *false* if should not.
  
> router[.id].beforeHook.remove

 Pass the same function which was passed in *add* and hook will be removed.
 
> router[.id].go
  
 Go to given route. Event expects object with at least *name*, e.g.:
 ```js
  {
    name: 'home'
  }
 ```
 
 but we can pass *params* if we have dynamic params in URL and *query* and *hash*, e.g.:
 ```js
  {
    name: 'article',
    params: {
      id: 123,
      title: 'article-about-someting'
    },
    query: {
      camefrom: 'homepage'
    },
    hash: 'comments'
  }
 ```
 
 Object passed above could go to URL */article/123/article-about-something?camefrom=homepage#comments*
 
> router[.id].go.back
  
  Goes to previous page
  
> router[.id].go.forward

  Goes to next page
  
> router[.id].go.by
  
  Gets number where and how far to go. E.g. -1 is same as back. -2 is go two pages before current.
  
> router.[id].currentRoute.get

  When called it will publish current route data on router[.id].currentRoute.value
  
> router[.id].terminate

  Will stop listening to this router and URL changes.
  
### Publishes

> router[.id].navigated

  When navigated to new route. Passess object of route.
  
> router[.id].navigated.notFound

  When page was not found then this topic is published.
  
> router[.id].currentRoute.value

  Publishes current route object when requested by *router.[id].currentRoute.get*
