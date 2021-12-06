import { IUserPost } from './interfaces/user'

export const USER_ROUTE = `http://localhost:8080/user`
export const DEFAULT_ACTION_VALUES: IUserPost = {
    name: '',
    surname: '',
    birthday: '',
    phone: '',
    email: ''
}
