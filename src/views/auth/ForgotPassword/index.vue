<template>
    <MainLayout>
        <div
            class="max-w-md w-full mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-xl my-auto animate-fade-in">

            <div class="text-center mb-6">
                <h2 class="text-2xl font-black text-slate-800">Khôi phục mật khẩu</h2>
                <p class="text-slate-400 text-xs mt-1">Xác thực danh tính an toàn qua hệ thống Email OTP</p>
            </div>

            <!-- BƯỚC 1: NHẬP EMAIL YÊU CẦU MÃ -->
            <form v-if="step === 1" @submit.prevent="handleSendOtp" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Email đăng ký tài khoản
                        (*)</label>
                    <input v-model="email" type="email" required placeholder="nhap-email-cua-anh@gmail.com"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50">
                    {{ loading ? 'Đang gửi yêu cầu tới Gmail...' : 'Gửi mã OTP xác thực ➔' }}
                </button>
            </form>

            <!-- BƯỚC 2: NHẬP OTP & ĐẶT MẬT KHẨU MỚI -->
            <form v-else @submit.prevent="handleResetPassword" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mã xác thực OTP (6 chữ
                        số)</label>
                    <input v-model="otp" type="text" required placeholder="Gồm 6 chữ số trong email"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-black tracking-widest text-center" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mật khẩu mới hoàn toàn
                        (*)</label>
                    <input v-model="password" type="password" required placeholder="Tối thiểu 6 ký tự"
                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold" />
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50">
                    {{ loading ? 'Đang cập nhật mật khẩu...' : 'Xác nhận đặt lại mật khẩu ✓' }}
                </button>
            </form>

            <div class="text-center mt-6">
                <router-link to="/login" class="text-xs font-bold text-blue-600 hover:underline">
                    ➔ Quay lại trang đăng nhập
                </router-link>
            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MainLayout from '../../../components/MainLayout.vue'

const router = useRouter()
const step = ref(1)
const email = ref('')
const otp = ref('')
const password = ref('')
const loading = ref(false)

const handleSendOtp = async () => {
    try {
        loading.value = true
        const res = await axios.post('http://localhost:8000/api/password/email', { email: email.value })
        alert(res.data.message)
        step.value = 2
    } catch (err) {
        alert(err.response?.data?.message || 'Email này chưa được đăng ký trong hệ thống!')
    } finally {
        loading.value = false
    }
}

const handleResetPassword = async () => {
    try {
        loading.value = true
        await axios.post('http://localhost:8000/api/password/reset', {
            email: email.value,
            otp: otp.value,
            password: password.value
        })
        alert('Khôi phục thành công! Mời anh đăng nhập tài khoản bằng mật khẩu mới.')
        router.push('/login')
    } catch (err) {
        alert(err.response?.data?.message || 'Mã xác thực OTP không chính xác hoặc đã hết hạn!')
    } finally {
        loading.value = false
    }
}
</script>