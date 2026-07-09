<template>
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans">

        <!-- HEADER / NAVBAR -->
        <header class="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-2xs">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16 items-center">

                    <!-- LÊ TRÁI: LOGO EDUPLAN -->
                    <div class="flex items-center gap-8">
                        <div @click="isLoggedIn ? $router.push('/dashboard') : $router.push('/login')"
                            class="flex items-center gap-2.5 cursor-pointer group">
                            <div
                                class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition duration-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                        class="text-blue-200" d="M9 11l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <span
                                    class="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                    EduPlan
                                </span>
                                <span
                                    class="block text-[10px] font-bold text-slate-400 -mt-1 tracking-wider uppercase">CDIO
                                    Project</span>
                            </div>
                        </div>

                        <!-- MENU ĐIỀU HƯỚNG (CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP) -->
                        <nav v-if="isLoggedIn" class="hidden md:flex items-center gap-1">
                            <router-link to="/dashboard" class="px-4 py-2 rounded-xl text-sm font-semibold transition"
                                :class="$route.path === '/dashboard' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                📊 Tổng quan
                            </router-link>

                            <router-link to="/subjects" class="px-4 py-2 rounded-xl text-sm font-semibold transition"
                                :class="$route.path.startsWith('/subjects') ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                📚 Môn học & Kanban
                            </router-link>

                            <router-link to="/calendar" class="px-4 py-2 rounded-xl text-sm font-semibold transition"
                                :class="$route.path === '/calendar' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                📅 Lịch Hạn Chót
                            </router-link>
                            <router-link to="/flashcards" class="px-4 py-2 rounded-xl text-sm font-semibold transition"
                                :class="$route.path.startsWith('/flashcards') ? 'bg-purple-50 text-purple-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                📇 Flashcard AI
                            </router-link>
                            <router-link to="/pomodoro" class="px-4 py-2 rounded-xl text-sm font-semibold transition"
                                :class="$route.path.startsWith('/pomodoro') ? 'bg-rose-50 text-rose-600 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                ⏱️ Pomodoro
                            </router-link>
                        </nav>
                    </div>

                    <!-- LÊ PHẢI 1: KHI ĐÃ ĐĂNG NHẬP (HIỆN USER & NÚT LOGOUT) -->
                    <div v-if="isLoggedIn" class="flex items-center gap-4">
                        <div
                            class="hidden sm:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
                            <div
                                class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                {{ userEmail ? userEmail.charAt(0).toUpperCase() : 'U' }}
                            </div>
                            <span class="text-xs font-semibold text-slate-700 max-w-[120px] truncate">{{ userEmail ||
                                'Sinh viên' }}</span>
                        </div>

                        <button @click="handleLogout"
                            class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center gap-1 cursor-pointer">
                            <span>Đăng xuất ➔</span>
                        </button>
                    </div>

                    <!-- LÊ PHẢI 2: KHI CHƯA ĐĂNG NHẬP (HIỆN NÚT LOGIN / REGISTER) -->
                    <div v-else class="flex items-center gap-2">
                        <router-link to="/login" class="px-4 py-2 rounded-xl text-xs font-bold transition"
                            :class="$route.path === '/login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'">
                            Đăng nhập
                        </router-link>
                        <router-link to="/register" class="px-4 py-2 rounded-xl text-xs font-bold transition"
                            :class="$route.path === '/register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'">
                            Đăng ký ngay
                        </router-link>
                    </div>

                </div>
            </div>
        </header>

        <!-- CONTENT AREA -->
        <main class="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <slot />
        </main>

        <!-- FOOTER CHÂN TRANG -->
        <footer class="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
            <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                <p class="font-medium">© 2026 <strong class="text-slate-600 font-bold">EduPlan Project</strong>. Built
                    with Vue 3 & Laravel 12.</p>
                <p class="flex items-center gap-1">
                    <span>Đồ án CDIO — Phát triển bởi</span>
                    <span class="font-bold text-blue-600">Team EduPlan</span>
                </p>
            </div>
        </footer>

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const userEmail = ref('')
const isLoggedIn = ref(false)

// Kiểm tra trạng thái đăng nhập và lấy thông tin user
const checkAuthAndFetchUser = async () => {
    const token = localStorage.getItem('access_token') // LUÔN DÙNG CHUẨN XÁC 'access_token'
    if (!token) {
        isLoggedIn.value = false
        userEmail.value = ''
        return
    }

    isLoggedIn.value = true
    try {
        const res = await axios.get('http://localhost:8000/api/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        userEmail.value = res.data.email || res.data.name
    } catch (error) {
        console.error('Token hết hạn hoặc lỗi:', error)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token')
            isLoggedIn.value = false
        }
    }
}

// Theo dõi khi đổi URL (để cập nhật lại trạng thái nếu vừa đăng nhập/đăng xuất xong)
watch(() => route.path, () => {
    checkAuthAndFetchUser()
})

const handleLogout = async () => {
    if (!confirm('Anh có chắc muốn đăng xuất khỏi EduPlan không?')) return
    try {
        const token = localStorage.getItem('access_token')
        if (token) {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }
    } catch (error) {
        console.log('Lỗi server khi logout...')
    } finally {
        localStorage.removeItem('access_token')
        isLoggedIn.value = false
        router.push('/login')
    }
}

onMounted(() => {
    checkAuthAndFetchUser()
})
</script>