import HTTP from 'http'

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
const port = process.env.PORT || 8080
const newServer = HTTP.createServer((req, res) => {
    res.write('Hello!')
    res.end()
})

newServer.listen(port, () => {
    console.log(`server running  at http://localhost:${port}/`) // @TODO c.url
    console.log(`press CTRL+C to stop server`)
})

newServer.close()