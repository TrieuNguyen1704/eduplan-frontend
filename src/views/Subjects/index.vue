<template>
    <MainLayout>
        <div class="max-w-5xl mx-auto">
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-slate-800">Quản lý Môn học</h1>
                    <p class="text-slate-500 mt-1">Danh sách các học phần trong học kỳ của anh</p>
                </div>
                <button @click="showModal = true"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition flex items-center gap-2">
                    <span>+ Thêm môn học</span>
                </button>
            </div>

            <!-- Danh sách môn học (Grid) -->
            <div v-if="loading" class="text-center py-12 text-slate-400">Đang tải dữ liệu...</div>

            <div v-else-if="subjects.length === 0"
                class="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <div class="text-4xl mb-3">📚</div>
                <h3 class="text-lg font-semibold text-slate-700">Chưa có môn học nào</h3>
                <p class="text-slate-400 text-sm mt-1">Anh hãy bấm nút "Thêm môn học" ở góc trên để bắt đầu nhé!</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <!-- ĐÃ THÊM @click VÀ cursor-pointer ĐỂ NHẤP VÀO LÀ MỞ WORKSPACE -->
                <div v-for="sub in subjects" :key="sub.id" @click="$router.push('/subjects/' + sub.id)"
                    class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition relative group cursor-pointer">
                    <div class="flex justify-between items-start mb-4">
                        <span
                            class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                            {{ sub.code || 'GEN' }}
                        </span>
                        <!-- ĐÃ SỬA THÀNH @click.stop ĐỂ KHÔNG BỊ NHẤP NHẦM VÀO WORKSPACE KHI XÓA -->
                        <button @click.stop="deleteSubject(sub.id)"
                            class="text-slate-300 hover:text-red-500 transition px-2 py-1" title="Xóa môn học">
                            ✕
                        </button>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{{ sub.name }}</h3>
                    <p class="text-sm text-slate-400 font-medium">Số tín chỉ: <span class="text-slate-600">{{
                        sub.credits }}</span></p>
                </div>
            </div>

            <!-- Modal Thêm môn học -->
            <div v-if="showModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
                    <h2 class="text-xl font-bold text-slate-800 mb-4">Thêm môn học mới</h2>
                    <form @submit.prevent="createSubject">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-600 mb-1">Tên môn học (*)</label>
                                <input v-model="form.name" type="text" required
                                    placeholder="VD: Tâm lý học đại cương, IELTS..."
                                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm" />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-sm font-medium text-slate-600 mb-1">Mã môn</label>
                                    <input v-model="form.code" type="text" placeholder="VD: PSY101"
                                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm uppercase" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-slate-600 mb-1">Số tín chỉ</label>
                                    <input v-model="form.credits" type="number" min="1" max="10"
                                        class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm" />
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" @click="showModal = false"
                                class="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-50 font-medium text-sm transition">
                                Hủy
                            </button>
                            <button type="submit"
                                class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm shadow-sm transition">
                                Lưu lại
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue'

const subjects = ref([])
const loading = ref(true)
const showModal = ref(false)

const form = reactive({
    name: '',
    code: '',
    credits: 3
})

// Cấu hình Axios tự động gắn Token (Đã dùng đúng 'access_token')
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return { headers: { Authorization: `Bearer ${token}` } }
}

// Lấy danh sách môn
const fetchSubjects = async () => {
    try {
        loading.value = true
        const res = await axios.get('http://localhost:8000/api/subjects', getAuthHeaders())
        subjects.value = res.data
    } catch (error) {
        console.error('Lỗi tải dữ liệu:', error)
    } finally {
        loading.value = false
    }
}

// Thêm môn học
const createSubject = async () => {
    try {
        await axios.post('http://localhost:8000/api/subjects', form, getAuthHeaders())
        showModal.value = false
        form.name = ''
        form.code = ''
        form.credits = 3
        fetchSubjects() // Tải lại danh sách
    } catch (error) {
        alert('Không thể thêm môn học. Anh kiểm tra lại kết nối nhé!')
    }
}

// Xóa môn học
const deleteSubject = async (id) => {
    if (!confirm('Anh có chắc muốn xóa học phần này không?')) return
    try {
        await axios.delete(`http://localhost:8000/api/subjects/${id}`, getAuthHeaders())
        fetchSubjects()
    } catch (error) {
        alert('Lỗi khi xóa môn học!')
    }
}

onMounted(() => {
    fetchSubjects()
})
</script>