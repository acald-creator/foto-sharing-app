import express from 'express'

const port = process.env.PORT || 8080
const app: express.Application = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const runningMessage = `Server running at http://localhost:${port}`
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
})

app.listen(port, () => {
    console.log(runningMessage)
})