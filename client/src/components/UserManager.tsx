import { useContext, useEffect } from 'react'
import { Typography, Layout } from 'antd'
import ActionModal from './ActionModal'
import { isMobile } from 'react-device-detect'
import { DEFAULT_ACTION_VALUES } from '../utils/constants'
import UserManagerControls from './UserManagerControls'
import UserTable from './UserTable'
import { AppContext } from '../AppContext'

const { Title } = Typography
const { Content } = Layout

function UserManager() {
    const {
        paginationState: [pagination],
        selectedRowsState: [selectedRows],
        actionState: [action, setAction],
        actionModalVisibilityState: [actionModalVisibility, setActionModalVisibility],

        fetchUsers,
        onAction
    } = useContext(AppContext)

    useEffect(() => {
        document.title = 'User Manager'

        fetchUsers(pagination)
    }, [])

    return (
        <>
            <Layout style={{ height: '100vh' }}>
                <Content
                    style={{
                        background: '#fff',
                        margin: isMobile ? 'none' : 50,
                        padding: isMobile ? 'none' : 24,
                        minHeight: 360
                    }}
                >
                    <div
                        style={isMobile ? { margin: '0 50px 0 50px', padding: '24px 24px 0 24px', width: '100%' } : {}}
                    >
                        <Title level={1}>User Manager</Title>

                        <div style={{ textAlign: 'left', margin: '10px 0' }}>
                            <UserManagerControls
                                fetchUsers={() => fetchUsers(pagination)}
                                selectedRows={selectedRows}
                                setAction={setAction}
                                setActionModalVisibility={setActionModalVisibility}
                            />
                        </div>
                    </div>

                    <UserTable />
                </Content>
            </Layout>

            <ActionModal
                action={action}
                values={selectedRows.length ? selectedRows[0] : DEFAULT_ACTION_VALUES}
                visible={actionModalVisibility}
                onAction={onAction}
                onCancel={() => setActionModalVisibility(false)}
            />
        </>
    )
}

export default UserManager
