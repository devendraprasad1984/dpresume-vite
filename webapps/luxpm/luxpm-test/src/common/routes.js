const isLocal = window.location.href.indexOf('localhost') !== -1
const prod_prefix = isLocal == true ? '' : '/luxpm'
const routes = {
    home: {key: prod_prefix + '/home', val: 'HOME'},
    login: {key: prod_prefix + '/login', val: 'LOGIN'},
    signup: {key: prod_prefix + '/signup', val: 'SIGN-UP'}
}
export default routes
