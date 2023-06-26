import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from './index';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (localStorage.getItem('ms_token')) {
        /* has token*/
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done();
        } else {
            next();
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next('/login'); // 否则全部重定向到登录页
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});
