import HTTP from 'http'
import * as AWS from 'aws-sdk'

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

const port = process.env.PORT || 8080
const newServer = HTTP.createServer((req, res) => {
    res.write('Hello!')
    res.end()
})

newServer.listen(port, () => {
    console.log(`server running at http://localhost:${port}/`) // @TODO c.url
    console.log(`press CTRL+C to stop server`)
})

newServer.close()