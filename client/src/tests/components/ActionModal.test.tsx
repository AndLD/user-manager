import { render, screen } from '@testing-library/react'
import { AppContext } from '../../AppContext'
import ActionModal from '../../components/ActionModal'

describe('ActionModal', () => {
    beforeEach(() =>
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn()
            }))
        })
    )

    test('render Update modal', () => {
        const testData = {
            name: 'TestName',
            surname: 'TestSurname',
            birthday: '04.04.1994',
            phone: '0123123123',
            email: 'test@gmail.com'
        }

        render(
            <AppContext.Provider
                value={{
                    actionState: ['Update'],
                    actionModalVisibilityState: [true, jest.fn()] as any,
                    onAction: jest.fn()
                }}
            >
                <ActionModal values={testData} />
            </AppContext.Provider>
        )

        for (const key in testData)
            expect(
                screen.getByRole('textbox', { name: `${key[0].toUpperCase()}${key.slice(1)}` }).getAttribute('value')
            ).toBe((testData as any)[key])
    })
})
