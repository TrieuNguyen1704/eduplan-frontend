<template>
    <MainLayout>
        <div class="space-y-8 animate-fade-in">

            <!-- Lời chào & Banner lời khuyên -->
            <div
                class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div class="relative z-10">
                    <span
                        class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                        🚀 Học kỳ mới 2026
                    </span>
                    <h1 class="text-3xl md:text-4xl font-black tracking-tight">Chào mừng bạn trở lại EduPlan!</h1>
                    <p class="text-blue-100 text-sm mt-1 max-w-xl">Hệ thống đang theo dõi tiến độ các môn học và nhiệm
                        vụ Kanban của bạn. Hãy duy trì nhịp độ học tập tuyệt vời này nhé!</p>
                </div>
                <button @click="$router.push('/subjects')"
                    class="relative z-10 px-6 py-3 bg-white text-blue-600 font-bold text-sm rounded-2xl shadow-lg hover:bg-blue-50 transition transform hover:-translate-y-0.5 cursor-pointer shrink-0">
                    + Quản lý Môn học ngay ➔
                </button>
                <!-- Hình trang trí chìm bên góc -->
                <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            <!-- Thẻ thống kê nhanh (Stats Grid) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div
                        class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black">
                        📚
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số môn học</p>
                        <h3 class="text-3xl font-black text-slate-800 mt-0.5">{{ subjects.length }} <span
                                class="text-xs font-medium text-slate-400">môn</span></h3>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div
                        class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-black">
                        🎓
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số tín chỉ</p>
                        <h3 class="text-3xl font-black text-slate-800 mt-0.5">{{ totalCredits }} <span
                                class="text-xs font-medium text-slate-400">tín chỉ</span></h3>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div
                        class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black">
                        ⚡
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái học tập</p>
                        <h3 class="text-lg font-black text-emerald-600 mt-1">Đang hoạt động tốt</h3>
                    </div>
                </div>

            </div>

            <!-- Danh sách môn học gần đây -->
            <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-slate-800">Môn học đang theo đuổi</h2>
                        <p class="text-xs text-slate-400 mt-0.5">Nhấp vào môn bất kỳ để mở Hộp thoại Kanban & Tài liệu
                        </p>
                    </div>
                    <router-link to="/subjects" class="text-xs font-bold text-blue-600 hover:underline">
                        Xem tất cả ➔
                    </router-link>
                </div>

                <div v-if="loading" class="text-center py-10 text-slate-400 text-sm">Đang đồng bộ dữ liệu...</div>

                <div v-else-if="subjects.length === 0"
                    class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p class="text-slate-500 font-medium text-sm">Anh chưa thêm môn học nào trong học kỳ này.</p>
                    <button @click="$router.push('/subjects')"
                        class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm">
                        Tạo môn học đầu tiên
                    </button>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div v-for="sub in subjects.slice(0, 6)" :key="sub.id" @click="$router.push('/subjects/' + sub.id)"
                        class="p-5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition cursor-pointer group flex justify-between items-center">
                        <div>
                            <span
                                class="text-[10px] font-extrabold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {{ sub.code || 'GEN' }}
                            </span>
                            <h4
                                class="font-bold text-slate-800 text-base mt-2 group-hover:text-blue-600 transition line-clamp-1">
                                {{ sub.name }}</h4>
                            <p class="text-xs text-slate-400 font-medium mt-1">{{ sub.credits }} tín chỉ học phần</p>
                        </div>
                        <span
                            class="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition text-lg font-bold">➔</span>
                    </div>
                </div>
            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue' // Import Master Layout

const subjects = ref([])
const loading = ref(true)

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token') // LUÔN CHUẨN XÁC
    return { headers: { Authorization: `Bearer ${token}` } }
}

const fetchSubjects = async () => {
    try {
        loading.value = true
        const res = await axios.get('http://localhost:8000/api/subjects', getAuthHeaders())
        subjects.value = res.data
    } catch (error) {
        console.error('Lỗi tải môn học:', error)
    } finally {
        loading.value = false
    }
}

// Tự động tính tổng tín chỉ
const totalCredits = computed(() => {
    return subjects.value.reduce((sum, sub) => sum + (Number(sub.credits) || 0), 0)
})

onMounted(() => {
    fetchSubjects()
})
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.25s ease-out forwards;
}
</style>