import { Table } from 'antd'
import { useContext } from 'react'
import { isMobile } from 'react-device-detect'
import { AppContext } from '../AppContext'

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
        dataIndex: 'birthday'
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

export default function UserTable() {
    const {
        paginationState: [pagination],
        tableDataState: [tableData],
        tableLoadingState: [tableLoading],
        selectedRowsState: [, setSelectedRows],

        fetchUsers
    } = useContext(AppContext)

    return (
        <Table
            bordered
            rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys: any, selectedRows: any) => {
                    setSelectedRows(selectedRows)
                },
                getCheckboxProps: (record: any) => ({
                    name: record.name
                })
            }}
            size={isMobile ? 'middle' : 'small'}
            columns={columns}
            rowKey={(record: any) => record.id}
            dataSource={tableData}
            pagination={pagination}
            loading={tableLoading}
            onChange={(pagination: any, filters) => {
                fetchUsers(pagination)
                console.log(filters)
            }}
            style={{ width: '100%', fontSize: 50 }}
        />
    )
}
