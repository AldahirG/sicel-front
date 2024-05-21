import Cookies from 'js-cookie';

const authGuard = (to, from, next) => {
    const token = Cookies.get('token');

    if (to.name !== 'Login' && !token) {
        if (to.name !== 'NotLoggedIn') {
            next({ name: 'NotLoggedIn' });
        } else {
            next();
        }
    } else if (to.name === 'Login' && token) {
        next({ name: 'admin' });
    } else {
        next();
    }
};

export default authGuard;