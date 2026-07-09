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
        path: '/forgot-password', 
        name: 'ForgotPassword', 
        component: () => import('../views/auth/ForgotPassword/index.vue'), 
        meta: { guestOnly: true } 
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/auth/Register/index.vue'),
        meta: { guest: true }
    },
    { 
        path: '/admin', 
        name: 'Admin', 
        component: () => import('../views/Admin/index.vue'), 
        meta: { requiresAuth: true } 
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
    },
    {
        path: '/subjects/:id',
        name: 'SubjectWorkspace',
        component: () => import('../views/Subjects/Workspace.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('../views/Calendar/index.vue'),
        meta: { requiresAuth: true }
    },
    { 
        path: '/flashcards', 
        name: 'Flashcards', 
        component: () => import('../views/Flashcards/index.vue'), 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/pomodoro', 
        name: 'Pomodoro', 
        component: () => import('../views/Pomodoro/index.vue'), 
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
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null

    // 1. Kiểm tra nếu trang cần đăng nhập mà chưa có token -> Về Login
    if (to.matched.some(record => record.meta.requiresAuth) && !token) {
        next('/login')
    } 
    // 2. Nếu đã có token mà vào trang Guest (như Login, Register) -> Về Dashboard
    else if (to.matched.some(record => record.meta.guest) && token) {
        next('/dashboard')
    } 
    // 3. LÍNH GÁC TRẠM ADMIN: Chặn sinh viên lén gõ /admin
    else if (to.path.startsWith('/admin')) {
        if (!user || (user.role !== 'admin' && user.email !== 'shellingofficial@gmail.com')) {
            alert('🚫 Cảnh báo: Khu vực hạn chế! Bạn không có quyền truy cập trang Quản Trị.')
            return next('/dashboard') // Đá ngược về Dashboard sinh viên
        }
        next()
    } 
    // 4. Các trường hợp còn lại -> Cho qua
    else {
        next()
    }
})

export default router