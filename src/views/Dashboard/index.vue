<template>
    <div class="min-h-screen bg-slate-100">
        <!-- Navbar -->
        <nav class="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-slate-800">EduPlan Dashboard</h1>
            <div class="flex items-center gap-4">
                <span class="text-sm text-slate-600">Xin chào, <strong class="text-slate-950">{{ authStore.user?.name
                }}</strong></span>
                <button @click="handleLogout"
                    class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-medium rounded-xl transition">
                    Đăng xuất
                </button>
            </div>
        </nav>

        <!-- Content -->
        <div class="p-8 max-w-7xl mx-auto">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Hệ thống đã kết nối hoàn hảo!</h2>
                <p class="text-slate-500">Mã Token hiện tại của anh đã được lưu an toàn trong hệ thống LocalStorage của
                    trình duyệt.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
}
</script>