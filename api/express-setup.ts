import loggerMiddleware from './middlewares/logger'
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'

const server = express()

server.use(express.json())

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}

server.use(cors(corsOptions))
server.use(loggerMiddleware)

export const app = server
export const Router = express.Router
