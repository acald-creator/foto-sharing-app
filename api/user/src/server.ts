import cors from 'cors'
import debug from 'debug'
import express from 'express'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import { IndexRoutes } from './routes/index.router'
import { UserRoutes } from './common/user.routes.config'
import { CommonRoutesConfig } from './common/common.routes.config'
import { sequelize } from './common/config/sequelize.config'
import { V0MODELS } from './routes/model.router'
import { AuthRoutes } from './common/auth.routes.config'

export async function InitExpressApp(
    port = process.env.PORT || 8080,
): Promise<void> {
    const app: express.Application = express()
    const routes: Array<CommonRoutesConfig> = []
    const debugLog: debug.IDebugger = debug('app')

    sequelize.addModels(V0MODELS)
    await sequelize.sync()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cors())

    app.use(
        (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) => {
            res.header('Access-Control-Allow-Origin', 'http://localhost:8081')
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            )
            next()
        },
    )

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
    routes.push(new AuthRoutes(app))
    routes.push(new UserRoutes(app))

    const runningMessage = `Server running at http://localhost:${port}`
    app.get('/', (req: express.Request, res: express.Response) => {
        res.status(200).send(runningMessage)
    })

    app.use((req: express.Request, res: express.Response) => {
        res.status(404).send('Not found')
    })

    app.listen(port, () => {
        routes.forEach((route: CommonRoutesConfig) => {
            debugLog(`Routes configured for ${route.getName()}`)
        })
        console.log(runningMessage)
    })
}

InitExpressApp()
