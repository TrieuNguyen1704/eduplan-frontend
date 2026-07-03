<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-extrabold text-slate-800">Chào mừng trở lại</h2>
                <p class="text-slate-500 mt-2 text-sm">Đăng nhập vào hệ thống EduPlan</p>
            </div>

            <!-- Hiển thị thông báo lỗi nếu có -->
            <div v-if="authStore.error"
                class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {{ authStore.error }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input v-model="email" type="email" required
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="example@gmail.com" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                    <input v-model="password" type="password" required
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="••••••••" />
                </div>

                <button type="submit" :disabled="authStore.loading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-200 transition disabled:opacity-50">
                    {{ authStore.loading ? 'Đang xử lý...' : 'Đăng nhập' }}
                </button>
            </form>

            <div class="text-center mt-6 text-sm text-slate-600">
                Chưa có tài khoản?
                <router-link to="/register" class="text-blue-600 font-medium hover:underline">Đăng ký ngay</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
    const success = await authStore.login(email.value, password.value)
    if (success) {
        router.push('/dashboard')
    }
}
</script>