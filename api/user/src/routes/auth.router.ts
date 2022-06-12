import express, { Router } from 'express'
import * as EmailValidator from 'email-validator'
import { User } from '../controllers/interfaces/models/User'

const router: Router = express.Router()

function generateJWT(user: User): string {
    return 'NotYetImplemented'
}

async function generatePassword(plainTextPassword: string): Promise<string> {
    return 'NotYetImplemented'
}

async function comparePasswords(
    plainTextPassword: string,
    hash: string,
): Promise<boolean> {
    return true
}

export function requireAuth(
    req: express.Express,
    res: express.Response,
    next: express.NextFunction,
) {
    console.warn(`auth router not yet implemented.`)
    return next()
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

    const user = await User.findByPk(email)
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

    // check email password valid
    if (!plainTextPassword) {
        return res
            .status(400)
            .send({ auth: false, message: 'Password is required' })
    }

    const user = await User.findByPk(email)
    if (user) {
        return res
            .status(422)
            .send({ auth: false, message: 'User may already exist' })
    }

    const password_hash = await generatePassword(plainTextPassword)

    const newUser = new User({
        email: email,
        password_hash: password_hash,
        createdAt: Date.now(),
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

router.get('/', async (req: express.Request, res: express.Response) => {
    res.send('auth')
})

export const AuthRouter: Router = router
