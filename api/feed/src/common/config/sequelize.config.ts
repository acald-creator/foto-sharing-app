import { Sequelize } from 'sequelize-typescript'
import { config } from './database.config'

const c = config.dev

const sequelize = new Sequelize({
    'username': c.username,
    'password': c.password,
    'database': c.database,
    'host': c.host,
    dialect: 'postgres',
    storage: ':memory:'
})

export { sequelize }