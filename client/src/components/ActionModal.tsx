import { Modal, Form, Input, DatePicker, notification } from 'antd'
import moment from 'moment'
import { useContext, useEffect } from 'react'
import { AppContext } from '../AppContext'
import { IUserPost } from '../utils/interfaces/user'

export default function ActionModal({ values }: { values: IUserPost }) {
    const {
        actionState: [action],
        actionModalVisibilityState: [actionModalVisibility, setActionModalVisibility],
        onAction
    } = useContext(AppContext)

    const [form] = Form.useForm()

    useEffect(() => {
        if (actionModalVisibility) form.resetFields()
    }, [actionModalVisibility])

    return (
        <Modal
            visible={actionModalVisibility}
            title={`${action} user`}
            okText={action}
            cancelText="Cancel"
            onCancel={(params) => {
                setActionModalVisibility(false)
                form.resetFields()
            }}
            onOk={() => {
                form.validateFields()
                    .then((values: any) => {
                        const actionBody: any = {}
                        for (const key in values) {
                            if (form.isFieldTouched(key)) {
                                actionBody[key] = values[key]
                            }
                        }
                        const body = actionBody.birthday
                            ? { ...actionBody, birthday: actionBody.birthday.format('DD.MM.YYYY') }
                            : actionBody
                        if (Object.keys(body).length) onAction(body)
                        else
                            notification.warning({
                                message: 'Warning',
                                description: 'You should do any changes to update user!'
                            })
                        form.resetFields()
                    })
                    .catch(() => {
                        notification.error({
                            message: 'Validation error',
                            description: 'Invalid form data!'
                        })
                    })
            }}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={
                    action === 'Update'
                        ? {
                              ...values,
                              birthday: values.birthday === '' ? '' : moment(values.birthday, 'DD.MM.YYYY')
                          }
                        : {}
                }
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of user!'
                        },
                        {
                            max: 60,
                            message: 'Cannot be longer than 60 characters!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="surname"
                    label="Surname"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the surname of user!'
                        },
                        {
                            max: 60,
                            message: 'Cannot be longer than 60 characters!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="birthday"
                    label="Birthday"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the birthday of user!'
                        }
                    ]}
                >
                    <DatePicker style={{ width: '100%' }} picker="date" format="DD.MM.YYYY" />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the phone of user!'
                        },
                        {
                            pattern: /^0[0-9]{9}$/,
                            message: 'The phone must match the template: 0xxxxxxxxx!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the email of user!'
                        },
                        {
                            type: 'email',
                            message: 'The email is incorrect!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}
