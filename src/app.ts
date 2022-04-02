import config from 'config'
import cors from 'cors'
import express, { Application } from 'express'
import logger from 'morgan'
import router from './router/router'

const app = express();

app.use(cors())
app.set('port', process.env.PORT || 8080)
app.use(express.json({}))
app.use(
  express.urlencoded({ parameterLimit: 50000, extended: true, limit: '4mb' })
)
app.use('/api', router)

function getRoutesOfLayer (path: string, layer: any): string[] {
  if (layer.method) {
    return [layer.method.toUpperCase() + ' ' + path]
  } else if (layer.route) {
    return getRoutesOfLayer(
      path + split(layer.route.path),
      layer.route.stack[0]
    )
  } else if (layer.name === 'router' && layer.handle.stack) {
    let routes: string[] = []

    layer.handle.stack.forEach((stackItem: any) => {
      routes = routes.concat(
        getRoutesOfLayer(path + split(layer.regexp), stackItem)
      )
    })

    return routes
  }

  return []
}

function split (thing: any): string {
  if (typeof thing === 'string') {
    return thing
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1')
      : '<complex:' + thing.toString() + '>'
  }
}

function getRoutes (app: Application): string[] {
  let routes: string[] = []

  app._router.stack.forEach((layer: any) => {
    routes = routes.concat(getRoutesOfLayer('', layer))
  })

  return routes
}

const appRoutes = getRoutes(app)

app.use(async (err, req, res, next) => {
  if (err) {
    return res
      .status(400)
      .json({ success: false, message: 'An error occured!' })
  }
})

export default app
