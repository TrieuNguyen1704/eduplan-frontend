<template>
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-extrabold text-slate-800">Tạo tài khoản</h2>
                <p class="text-slate-500 mt-2 text-sm">Bắt đầu lập kế hoạch học tập cùng AI</p>
            </div>

            <!-- Bắt lỗi từ Store -->
            <div v-if="typeof authStore.error === 'string'"
                class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                {{ authStore.error }}
            </div>
            <div v-else-if="authStore.error"
                class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                <ul class="list-disc pl-4">
                    <li v-for="(errs, field) in authStore.error" :key="field">
                        {{ errs[0] }}
                    </li>
                </ul>
            </div>

            <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                    <input v-model="name" type="text" required
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="Nguyễn Văn A" />
                </div>

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
                        placeholder="Tối thiểu 6 ký tự" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
                    <input v-model="passwordConfirmation" type="password" required
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="••••••••" />
                </div>

                <button type="submit" :disabled="authStore.loading"
                    class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-200 transition disabled:opacity-50">
                    {{ authStore.loading ? 'Đang khởi tạo...' : 'Đăng ký tài khoản' }}
                </button>
            </form>

            <div class="text-center mt-6 text-sm text-slate-600">
                Đã có tài khoản?
                <router-link to="/login" class="text-blue-600 font-medium hover:underline">Đăng nhập</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const handleRegister = async () => {
    const success = await authStore.register(name.value, email.value, password.value, passwordConfirmation.value)
    if (success) {
        router.push('/dashboard')
    }
}
</script>