import { Router } from '../express-setup'
import { validate } from 'simple-express-validation'
import { PostUserSchema, PutUserSchema } from '../validation/user'
import { deleteUser, getUser, postUser, putUser } from '../controllers/user'

export const userRouter = Router()

userRouter.get('/', getUser)

userRouter.post('/', validate(PostUserSchema), postUser)

userRouter.put('/:id', validate(PutUserSchema), putUser)

userRouter.delete('/', deleteUser)
