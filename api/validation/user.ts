export const PostUserSchema = {
    _allowedProps: ['name', 'surname', 'birthday', 'phone', 'email'],
    name: {
        required: true,
        type: 'string',
        maxStringLength: 60
    },
    surname: {
        required: true,
        type: 'string',
        maxStringLength: 60
    },
    birthday: {
        required: true,
        type: 'string',
        regexp: /^[0-9]{2}.[0-9]{2}.[0-9]{4}$/
    },
    phone: {
        required: true,
        type: 'string',
        regexp: /^0[0-9]{9}$/
    },
    email: {
        required: true,
        type: 'string',
        isEmail: true
    }
}

export const PutUserSchema = {
    _allowedProps: ['name', 'surname', 'birthday', 'phone', 'email'],
    name: {
        type: 'string',
        maxStringLength: 60
    },
    surname: {
        type: 'string',
        maxStringLength: 60
    },
    birthday: {
        type: 'string',
        regexp: /^[0-9]{2}.[0-9]{2}.[0-9]{4}$/
    },
    phone: {
        type: 'string',
        regexp: /^0[0-9]{9}$/
    },
    email: {
        type: 'string',
        isEmail: true
    }
}
