import { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger'

export default (req: Request, _: Response, next: NextFunction) => {
    logger.info(`${req.method}, ${req.url}`)
    next()
}
