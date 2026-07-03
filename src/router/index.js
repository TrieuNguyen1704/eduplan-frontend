import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/Login/index.vue'),
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/auth/Register/index.vue'),
        meta: { guest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard/index.vue'),
        meta: { requiresAuth: true }
    },
    // THÊM ROUTE MÔN HỌC VÀO ĐÂY
    {
      path: '/subjects',
      name: 'Subjects',
      component: () => import('../views/Subjects/index.vue'),
      meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Hộ chiếu bảo vệ tuyến đường (Navigation Guard)
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')

    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login')
    } else if (to.matched.some(record => record.meta.guest) && token) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router