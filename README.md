# Chab Router

### Subscribes for

> router[.id].init

  Call when you want to router start playing.
  It will check current path, match route and fire events.

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
          id: /^\d+$/
        }
      }
    ]
  ```