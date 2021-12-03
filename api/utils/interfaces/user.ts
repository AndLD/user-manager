export interface IUser {
    name: string
    surname: string
    birthday: number
    phone: string
    email: string
    timestamp: number
}

export interface IUserPost {
    name: string
    surname: string
    birthday: number
    phone: string
    email: string
}

export interface IUserPut {
    name?: string
    surname?: string
    birthday?: number
    phone?: string
    email?: string
}
