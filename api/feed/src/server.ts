import cors from 'cors'
import HTTP from 'http'
import debug from 'debug'
import express from 'express'
import * as AWS from 'aws-sdk'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import { CommonRoutesConfig } from './common/common.routes.config'
import { FeedRoutes } from './routes/feed.routes.config'
import { IndexRoutes } from './routes/index.router'

const config = {
    "dev": {
        "username": process.env.POSTGRES_USERNAME,
        "password": process.env.POSTGRES_PASSWORD,
        "database": process.env.POSTGRES_DB,
        "host": process.env.POSTGRES_HOST,
        "dialect": "postgres",
        "aws_region": process.env.AWS_REGION,
        "aws_profile": process.env.AWS_PROFILE,
        "aws_media_bucket": process.env.AWS_BUCKET,
        "url": process.env.URL
    },
    "prod": {
        "username": "",
        "password": "",
        "database": "foto-share-prod",
        "host": "",
        "dialect": "postgres"
    },
    "jwt": {
        "secret": process.env.JWT_SECRET
    }
}

const c = config.dev

const credentials = new AWS.SharedIniFileCredentials({ profile: c.aws_profile })
AWS.config.credentials = credentials

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: c.aws_region,
    params: { Bucket: c.aws_media_bucket},
})

const signedURLExpireSeconds = 60 * 5

/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
function getSigedURL(key: string): string {
    const url = s3.getSignedUrl('getObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedURLExpireSeconds,
    })

    return url
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
function getPutSignedURL(key: string) {
    const url = s3.getSignedUrl('putObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedURLExpireSeconds
    })

    return url
}

const app: express.Application = express()
const port = process.env.PORT || 8080
const newServer: HTTP.Server = HTTP.createServer()
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
        winston.format.colorize({ all: true })
    ),
}

if (!process.env.DEBUG) {
    loggerOptions.meta = false
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new IndexRoutes(app))
routes.push(new FeedRoutes(app))

const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
})

newServer.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
})