import express from 'express'
import { CommonRoutesConfig } from './common.routes.config'
import { UserInfo } from '../controllers/interfaces/models/User'

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes')
    }

    configureRoutes(): express.Application {
        this.app
            .route('/:id')
            .get(async (req: express.Request, res: express.Response) => {
                const { id } = req.params
                const item = await UserInfo.findByPk(id)
                res.status(200).send(item)
            })
        return this.app
    }
}
