import express from 'express'
import { requireAuth } from '../routes/auth.router'
import { CommonRoutesConfig } from './common.routes.config'

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes')
    }

    configureRoutes(): express.Application {
        this.app
            .route('/verification')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send({ auth: true, message: 'Authenticated.' })
            })
        this.app
            .route('/')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send('Use authentication')
            })
        return this.app
    }
}
