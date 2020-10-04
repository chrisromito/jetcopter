import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()

/** Cookies/sessions, request parsing, url encoding, etc
 * @see https://www.codementor.io/mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
 */
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: false
}))


export const App = app
export default App
