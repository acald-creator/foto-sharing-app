import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'

export class IndexRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'IndexRoutes')
    }

    configureRoutes() {
        this.app
            .route(`/api/v0`)
            .get((req: express.Request, res: express.Response) => {
                res.send(`/api/v0`)
            })
        return this.app
    }
}
