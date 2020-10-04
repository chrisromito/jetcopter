import dotenv from 'dotenv'
dotenv.config()
import http from 'http'
import { App } from './app'

//-- Project imports

export const Server = http.createServer(App)
export default Server

