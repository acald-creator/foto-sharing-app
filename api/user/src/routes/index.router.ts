import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'

export class IndexRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'IndexRoutes')
    }

    configureRoutes() {
        this.app
            .route(`/`)
            .get((req: express.Request, res: express.Response) => {
                res.send(`V0`)
            })
        return this.app
    }
}
