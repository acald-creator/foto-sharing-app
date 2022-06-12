import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes')
    }

    configureRoutes(): express.Application {
        this.app
            .route('/user')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send('USER')
            })
        return this.app
    }
}