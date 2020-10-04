import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../constants'

const JWT_CONFIG = {
    expiresIn: '8h'
}


export const createJwtForUser = userId =>
    new Promise((resolve, reject) =>
        jwt.sign(
            {
                userId
            },
            SECRET_KEY,
            JWT_CONFIG,
            (err, token) =>
                err
                    ? reject(err)
                    : resolve(token)
        )
    )


const verifyToken = token =>
    new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY,
            (err, decoded) =>
                err
                    ? reject(err)
                    : resolve(decoded)
        )
    })


export const SocketMiddleware = (req, done) => {
    const token = parseAuthHeader(req) || false

    return token
        ? verifyToken(token).then(() => done()).catch(done)
        : done({
            message: 'Authentication required',
            statusCode: 403
        })
}

/**
 * @func parseAuthHeader - parse the 'authorization' key/val pair when
 * given an express Request Object
 * @param req
 * @returns {*}
 */
export const parseAuthHeader = req => {
    const auth = req.get('authorization')
    return !auth || !auth.toLowerCase().startsWith('bearer')
        ? null
        : stripTokenFromAuthValue(auth)
}


const stripTokenFromAuthValue = authString => authString.slice(bearerLength).trim()


const bearerLength = 'bearer'.length
