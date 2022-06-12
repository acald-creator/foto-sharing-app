import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import express, { Router } from 'express'
import * as EmailValidator from 'email-validator'
import { config } from '../common/config/database.config'
import { UserInfo } from '../controllers/interfaces/models/User'
import { CommonRoutesConfig } from '../common/common.routes.config'

const router: Router = express.Router()
const c = config.dev
const j = config.jwt
// const payload = { 'urn:example:claim': true }

async function generateJWT(user: UserInfo): Promise<string> {
    return jwt.sign(user.short(), j.secret)
}

async function generatePassword(plainTextPassword: string): Promise<string> {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(plainTextPassword, salt)
}

async function comparePasswords(
    plainTextPassword: string,
    hash: string,
): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hash)
}

export async function requireAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).send({ message: 'No authorization headers ' })
    }

    const tokenBearer = req.headers.authorization.split(' ')
    if (tokenBearer.length != 2) {
        return res.status(401).send({ message: 'Malformed token' })
    }

    const token = tokenBearer[1]
    return jwt.verify(token, j.secret, (err, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({ auth: false, message: 'Failed to authenticate.' })
        }
        return next()
    })
}

router.get(
    '/verification',
    requireAuth,
    async (req: express.Request, res: express.Response) => {
        return res.status(200).send({ auth: true, message: 'Authenticated' })
    },
)

router.post('/login', async (req: express.Request, res: express.Response) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !EmailValidator.validate(email)) {
        return res
            .status(400)
            .send({ auth: false, message: 'Email is required or malformed.' })
    }

    if (!password) {
        return res
            .status(400)
            .send({ auth: false, message: 'Password is required.' })
    }

    const user = await UserInfo.findByPk(email)
    if (!user) {
        return res.status(401).send({ auth: false, message: 'Unauthorized. ' })
    }

    const authValid = await comparePasswords(password, user.password_hash)
    if (!authValid) {
        return res.status(401).send({ auth: false, message: 'Unauthorized' })
    }

    const jwt = generateJWT(user)
    res.status(200).send({ auth: true, token: jwt, user: user.short() })
})

router.post('/', async (req: express.Request, res: express.Response) => {
    const email = req.body.email
    const plainTextPassword = req.body.password
    if (!email || !EmailValidator.validate(email)) {
        return res
            .status(400)
            .send({ auth: false, message: 'Email is required or malformed' })
    }

    if (!plainTextPassword) {
        return res
            .status(400)
            .send({ auth: false, message: 'Password is required' })
    }

    const user = await UserInfo.findByPk(email)
    if (user) {
        return res
            .status(422)
            .send({ auth: false, message: 'User may already exist' })
    }

    const generatedHash = await generatePassword(plainTextPassword)
    const newUser = new UserInfo({
        email: email,
        password_hash: generatedHash,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    })

    let savedUser
    try {
        savedUser = await newUser.save()
    } catch (e) {
        throw e
    }

    const jwt = generateJWT(savedUser)
    res.status(201).send({ token: jwt, user: savedUser.short() })
})
