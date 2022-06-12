import cors from 'cors'
import debug from 'debug'
import express from 'express'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import { IndexRoutes } from './routes/index.router'
import { FeedRoutes } from './routes/feed.routes.config'
import { CommonRoutesConfig } from './common/common.routes.config'

const app: express.Application = express()
const port = process.env.PORT || 8080
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug('app')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
    ),
}

if (!process.env.DEBUG) {
    loggerOptions.meta = false
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new IndexRoutes(app))
routes.push(new FeedRoutes(app))

const runningMessage = `Server running at http://localhost:${port}`
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
})

app.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`)
    })
    console.log(runningMessage)
})
