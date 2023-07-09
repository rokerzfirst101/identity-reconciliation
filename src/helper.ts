export const pushIfValueNotNullAndNotInArray = <T>(array: T[], data: T | undefined): T[] => {
    if (data === undefined || data === null) {
        return array
    }

    if (array.indexOf(data) === -1) {
        array.push(data)
    }

    return array
}