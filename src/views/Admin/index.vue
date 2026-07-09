<template>
    <AdminLayout>
        <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">

            <!-- BANNER QUẢN TRỊ VIÊN -->
            <div
                class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="space-y-2">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
                        <span>🛡️ System Administration</span>
                    </div>
                    <h1 class="text-3xl font-black tracking-tight">Trung Tâm Quản Trị EduPlan CDIO</h1>
                    <p class="text-slate-400 text-sm">Giám sát tài nguyên, phân tích dữ liệu học tập và quản lý quyền
                        hạn thành viên.</p>
                </div>
                <div class="text-right hidden md:block">
                    <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tech Lead / Admin</div>
                    <div class="text-lg font-black text-indigo-400">Triều Nguyên</div>
                </div>
            </div>

            <!-- ================= LƯỚI THỐNG KÊ TỔNG QUAN (4 THẺ STATS) ================= -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <!-- Thẻ 1: Thành viên -->
                <div
                    class="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-5 hover:border-indigo-100 transition">
                    <div
                        class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl shrink-0">
                        👥
                    </div>
                    <div>
                        <div class="text-2xl font-black text-slate-800">{{ stats.total_users }}</div>
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Thành viên</div>
                    </div>
                </div>

                <!-- Thẻ 2: Môn học -->
                <div
                    class="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-5 hover:border-indigo-100 transition">
                    <div
                        class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl shrink-0">
                        📚
                    </div>
                    <div>
                        <div class="text-2xl font-black text-slate-800">{{ stats.total_subjects }}</div>
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Môn học </div>
                    </div>
                </div>

                <!-- Thẻ 3: Task & Deadline -->
                <div
                    class="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-5 hover:border-indigo-100 transition">
                    <div
                        class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 text-2xl shrink-0">
                        📌
                    </div>
                    <div>
                        <div class="text-2xl font-black text-slate-800">{{ stats.total_tasks }}</div>
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Task & Deadline</div>
                    </div>
                </div>

                <!-- Thẻ 4: Thời gian Pomodoro -->
                <div
                    class="bg-white p-6 rounded-3xl border border-slate-100 shadow-2xs flex items-center gap-5 hover:border-indigo-100 transition">
                    <div
                        class="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 text-2xl shrink-0">
                        ⏱️
                    </div>
                    <div>
                        <div class="text-2xl font-black text-slate-800">{{ stats.total_pomodoro_minutes }} <span
                                class="text-xs font-normal">phút</span></div>
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng giờ học</div>
                    </div>
                </div>

            </div>

            <!-- ================= BẢNG QUẢN LÝ THÀNH VIÊN ================= -->
            <div class="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 class="font-black text-slate-800 text-base">📋 Danh Sách Tài Khoản Hệ Thống</h3>
                        <p class="text-xs text-slate-400 mt-0.5">Quản lý các tài khoản sinh viên và thành viên nhóm phát
                            triển</p>
                    </div>
                    <button @click="fetchData"
                        class="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer">
                        🔄 Làm mới
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th class="py-4 px-6">ID</th>
                                <th class="py-4 px-6">Thành viên</th>
                                <th class="py-4 px-6">Email</th>
                                <th class="py-4 px-6">Quyền hạn</th>
                                <th class="py-4 px-6">Ngày tham gia</th>
                                <th class="py-4 px-6 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition">
                                <td class="py-4 px-6 font-bold text-slate-400">#{{ user.id }}</td>

                                <td class="py-4 px-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs shrink-0">
                                            {{ user.name.charAt(0) }}
                                        </div>
                                        <span class="font-bold text-slate-900">{{ user.name }}</span>
                                    </div>
                                </td>

                                <td class="py-4 px-6 text-slate-500 font-mono">{{ user.email }}</td>

                                <td class="py-4 px-6">
                                    <span v-if="user.role === 'admin' || user.email === 'shellingofficial@gmail.com'"
                                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-black text-[10px] uppercase tracking-wider">
                                        👑 Tech Lead
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider">
                                        Sinh viên
                                    </span>
                                </td>

                                <td class="py-4 px-6 text-slate-400">
                                    {{ new Date(user.created_at).toLocaleDateString('vi-VN') }}
                                </td>

                                <td class="py-4 px-6 text-right">
                                    <button v-if="user.email !== 'shellingofficial@gmail.com' && user.role !== 'admin'"
                                        @click="deleteUser(user.id, user.name)"
                                        class="text-slate-400 hover:text-red-600 font-bold px-2 py-1 transition cursor-pointer"
                                        title="Xóa thành viên này">
                                        🗑️ Xóa
                                    </button>
                                    <span v-else class="text-slate-300 italic text-[11px]">Bảo vệ</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue'
import AdminLayout from '../../components/AdminLayout.vue'

const stats = ref({ total_users: 0, total_subjects: 0, total_tasks: 0, total_flashcards: 0, total_pomodoro_minutes: 0 })
const users = ref([])

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
})

const fetchData = async () => {
    try {
        const [statsRes, usersRes] = await Promise.all([
            axios.get('http://localhost:8000/api/admin/stats', getAuthHeaders()),
            axios.get('http://localhost:8000/api/admin/users', getAuthHeaders())
        ])
        stats.value = statsRes.data
        users.value = usersRes.data
    } catch (err) {
        if (err.response && err.response.status === 403) {
            alert('🚫 Bạn không có quyền truy cập vào trang Admin!')
        } else {
            console.error('Lỗi tải dữ liệu Admin:', err)
        }
    }
}

const deleteUser = async (id, name) => {
    if (!confirm(`⚠️ Anh có chắc chắn muốn xóa tài khoản "${name}" khỏi hệ thống EduPlan không?`)) return
    try {
        await axios.delete(`http://localhost:8000/api/admin/users/${id}`, getAuthHeaders())
        users.value = users.value.filter(u => u.id !== id)
        stats.value.total_users--
    } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa thành viên!')
    }
}

onMounted(() => {
    fetchData()
})
</script>