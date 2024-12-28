export const config = {
    env: window.location.href.indexOf('localhost') !== -1 ? 'local' : 'server',
    apis: {
        users: 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
    },
    utils: {
        deepCopy: obj => JSON.parse(JSON.stringify(obj)),
        getPageIndex: (cur) => {
            let itemsPerPage = enums.numberOfItemsPerPage
            let _start = (cur - 1) * itemsPerPage
            let _end = cur * itemsPerPage
            return {_start, _end}
        }
    }
}

export const enums = {
    env: {local: 'local', server: 'server'},
    numberOfItemsPerPage: 10,
    headings: {
        admin: 'Admin Interface, XYZ Corp.',
    },
    labels: {
        adminSearch: 'AdminSearch'
    },
    placeholders: {
        adminSearch: 'search here by name,email, role..'
    }

}

export const formLabels = {
    adminLabels: {
        name: 'name',
        email: 'email',
        role: 'role'
    }
}
