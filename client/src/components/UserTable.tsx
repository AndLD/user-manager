import { Button, DatePicker, Table } from 'antd'
import moment from 'moment'
import { useContext, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { AppContext } from '../AppContext'

export default function UserTable() {
    const {
        paginationState: [pagination, setPagination],
        filtersState: [filters, setFilters],
        tableDataState: [tableData],
        tableLoadingState: [tableLoading],
        selectedRowsState: [, setSelectedRows],

        fetchUsers
    } = useContext(AppContext)

    const [gtDatePickerValue, setGtDatePickerValue] = useState<string>('')
    const [ltDatePickerValue, setLtDatePickerValue] = useState<string>('')

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Surname',
            dataIndex: 'surname'
        },
        {
            title: 'Birthday',
            dataIndex: 'birthday',
            filterDropdown: () => {
                return (
                    <div style={{ padding: 10 }}>
                        <span>{'After'}</span>
                        <DatePicker
                            value={gtDatePickerValue === '' ? '' : (moment(gtDatePickerValue, 'DD.MM.YYYY') as any)}
                            style={{ display: 'block' }}
                            picker="date"
                            format="DD.MM.YYYY"
                            onChange={(_, dateString) => setGtDatePickerValue(dateString)}
                        />
                        <span>{'Before'}</span>
                        <DatePicker
                            value={ltDatePickerValue === '' ? '' : (moment(ltDatePickerValue, 'DD.MM.YYYY') as any)}
                            style={{ display: 'block' }}
                            picker="date"
                            format="DD.MM.YYYY"
                            onChange={(_, dateString) => setLtDatePickerValue(dateString)}
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            disabled={gtDatePickerValue === '' && ltDatePickerValue === ''}
                            type="primary"
                            onClick={() => {
                                const newFilters = []
                                if (gtDatePickerValue.length) newFilters.push(`birthday,gt,${gtDatePickerValue}`)
                                if (ltDatePickerValue.length) newFilters.push(`birthday,lt,${ltDatePickerValue}`)
                                setFilters(newFilters)
                                setPagination({ ...pagination, current: 1 })
                            }}
                        >
                            Filter
                        </Button>
                        <Button
                            disabled={!filters.length}
                            onClick={() => {
                                setFilters([])
                                setGtDatePickerValue('')
                                setLtDatePickerValue('')
                                fetchUsers(pagination)
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                )
            }
        },
        {
            title: 'Phone',
            dataIndex: 'phone'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp'
        }
    ]

    return (
        <Table
            bordered
            rowSelection={{
                type: 'checkbox',
                onChange: (_, selectedRows) => setSelectedRows(selectedRows)
            }}
            size={isMobile ? 'middle' : 'small'}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={tableData}
            pagination={pagination}
            loading={tableLoading}
            onChange={(pagination) => fetchUsers(pagination)}
            style={{ width: '100%', fontSize: 50 }}
        />
    )
}
