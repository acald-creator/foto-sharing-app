import cors from 'cors'
import debug from 'debug'
import express from 'express'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import { IndexRoutes } from './routes/index.router'
import { UserRoutes } from './routes/user.routes.config'
import { CommonRoutesConfig } from './common/common.routes.config'

const port = process.env.PORT || 8080
const app: express.Application = express()
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
routes.push(new UserRoutes(app))

const runningMessage = `Server running at http://localhost:${port}`
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
})

app.listen(port, () => {
    console.log(runningMessage)
})