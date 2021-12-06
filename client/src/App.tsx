import axios, { AxiosError, AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { AppContext } from './AppContext'
import UserManager from './components/UserManager'
import { USER_ROUTE } from './utils/constants'
import { IUser } from './utils/interfaces/user'
import { errorNotification, successNotification, warningNotification } from './utils/notifications'
import { Action, Pagination } from './utils/types'

function App() {
    const [pagination, setPagination] = useState<Pagination>({
        current: 1,
        pageSize: 10
    })
    const [filters, setFilters] = useState<string[]>([])
    const [tableData, setTableData] = useState<IUser[]>([])
    const [tableLoading, setTableLoading] = useState(false)
    const [selectedRows, setSelectedRows] = useState<IUser[]>([])

    const [action, setAction] = useState<Action>('Add')
    const [actionModalVisibility, setActionModalVisibility] = useState(false)

    function fetchUsers(pagination: Pagination, filters?: string[]) {
        setTableLoading(true)
        axios(USER_ROUTE, {
            params: {
                page: pagination.current,
                results: pagination.pageSize,
                filters: filters ? filters.join(';') : undefined
            }
        })
            .then((res: AxiosResponse) => {
                if (!res.data.meta?.pagination) throw new Error('No pagination obtained')
                setTableData(res.data.data)
                setTableLoading(false)
                setPagination({
                    ...pagination,
                    total: res.data.meta.pagination.total
                })
            })
            .catch((e: AxiosError) => errorNotification(`Error while fetching (${e.code})`))
    }

    function onAction(body: any) {
        setActionModalVisibility(false)
        axios(action === 'Add' ? USER_ROUTE : `${USER_ROUTE}/${selectedRows[0].id}`, {
            method: action === 'Add' ? 'POST' : 'PUT',
            data: body
        })
            .then((res: AxiosResponse) => {
                const result: string = res.data.data.result

                if (result === 'created' || result === 'updated') {
                    fetchUsers(pagination)
                    successNotification(`User has been successffully ${result}!`)
                } else warningNotification('Changes has not been saved!')
            })
            .catch((e: AxiosError) =>
                errorNotification(`Error while ${action === 'Add' ? 'creating' : 'updating'} ${e.code}`)
            )
    }

    useEffect(() => {
        if (filters.length) fetchUsers(pagination, filters)
    }, [filters])

    return (
        <AppContext.Provider
            value={{
                paginationState: [pagination, setPagination],
                filtersState: [filters, setFilters],
                tableDataState: [tableData, setTableData],
                tableLoadingState: [tableLoading, setTableLoading],
                selectedRowsState: [selectedRows, setSelectedRows],
                actionState: [action, setAction],
                actionModalVisibilityState: [actionModalVisibility, setActionModalVisibility],

                fetchUsers,
                onAction
            }}
        >
            <UserManager />
        </AppContext.Provider>
    )
}

export default App
