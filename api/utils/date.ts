export function createTimestamp() {
    return new Date(Date.now())
        .toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        })
        .replace(',', '')
}
