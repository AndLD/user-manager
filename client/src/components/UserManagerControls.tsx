import { Button, Popconfirm } from 'antd'
import axios, { AxiosError } from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { USER_ROUTE } from '../utils/constants'
import { IUser } from '../utils/interfaces/user'
import { errorNotification, successNotification } from '../utils/notifications'
import { Action } from '../utils/types'

export default function UserManagerControls({
    fetchUsers,
    selectedRows,
    setAction,
    setActionModalVisibility
}: {
    fetchUsers: () => void
    selectedRows: IUser[]
    setAction: Dispatch<SetStateAction<Action>>
    setActionModalVisibility: Dispatch<SetStateAction<boolean>>
}) {
    function showActionModal(newAction: Action) {
        setAction(newAction)
        setActionModalVisibility(true)
    }

    function deleteUsers() {
        axios(USER_ROUTE, {
            method: 'DELETE',
            params: {
                ids: selectedRows.map((elem: any) => elem.id).toString()
            }
        })
            .then(() => {
                fetchUsers()
                successNotification('Deleting was successffully done!')
            })
            .catch((e: AxiosError) => errorNotification(`Error while deleting (${e.code})`))
    }

    return (
        <>
            <Button style={{ margin: '0 5px 0 0' }} type="primary" onClick={() => showActionModal('Add')}>
                Add
            </Button>
            <Button
                style={{ margin: '0 5px' }}
                type="primary"
                disabled={selectedRows.length !== 1}
                onClick={() => showActionModal('Update')}
            >
                Update
            </Button>
            <Popconfirm
                disabled={selectedRows.length === 0}
                title="Are you sure to delete this task?"
                onConfirm={deleteUsers}
                okText="Yes"
                cancelText="No"
            >
                <Button style={{ margin: '0 5px' }} type="primary" disabled={selectedRows.length === 0}>
                    Delete
                </Button>
            </Popconfirm>
        </>
    )
}
