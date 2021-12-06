export interface IUser {
    id?: string
    name: string
    surname: string
    birthday: string
    phone: string
    email: string
    timestamp: string
}

export interface IUserPost {
    name: string
    surname: string
    birthday: string
    phone: string
    email: string
}

export interface IUserPut {
    name?: string
    surname?: string
    birthday?: string
    phone?: string
    email?: string
}
