import { Button, Popconfirm } from 'antd'
import axios, { AxiosError } from 'axios'
import { useContext } from 'react'
import { AppContext } from '../AppContext'
import { USER_ROUTE } from '../utils/constants'
import { errorNotification, successNotification } from '../utils/notifications'
import { Action } from '../utils/types'

export default function UserManagerControls() {
    const {
        selectedRowsState: [selectedRows],
        paginationState: [pagination],
        actionState: [, setAction],
        actionModalVisibilityState: [, setActionModalVisibility],

        fetchUsers
    } = useContext(AppContext)

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
                fetchUsers(pagination)
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
                title="Are you sure to delete?"
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
