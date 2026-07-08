<template>
    <MainLayout>
        <div class="space-y-6 animate-fade-in">

            <div
                class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <h1 class="text-2xl font-black text-slate-800">📅 Lịch Hạn Chót Học Tập</h1>
                    <p class="text-slate-400 text-xs mt-0.5">Hệ thống tự động đồng bộ thời gian nộp bài, tiểu luận của
                        tất cả các môn học</p>
                </div>

                <div
                    class="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                    <button @click="changeMonth(-1)"
                        class="p-1 hover:bg-slate-200 rounded-lg transition cursor-pointer select-none">◀</button>
                    <span class="min-w-[110px] text-center">Tháng {{ currentMonth + 1 }} / {{ currentYear }}</span>
                    <button @click="changeMonth(1)"
                        class="p-1 hover:bg-slate-200 rounded-lg transition cursor-pointer select-none">▶</button>
                </div>
            </div>

            <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">

                <div
                    class="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                    <div v-for="day in ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']" :key="day"
                        class="py-2">
                        {{ day }}
                    </div>
                </div>

                <div class="grid grid-cols-7 gap-2">

                    <div v-for="blank in blankDays" :key="'blank-' + blank"
                        class="h-28 bg-slate-50/40 rounded-xl border border-dashed border-slate-100"></div>

                    <div v-for="date in daysInMonth" :key="date"
                        class="h-28 bg-slate-50 rounded-xl p-2 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/10 transition flex flex-col justify-between group overflow-y-auto">
                        <span class="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">{{ date
                            }}</span>

                        <div class="space-y-1 mt-1 flex-1 flex flex-col justify-end overflow-hidden">
                            <div v-for="task in getTasksForDate(date)" :key="task.id"
                                @click.stop="$router.push('/subjects/' + task.subject_id)"
                                :class="getLabelColorClass(task.label_color)"
                                class="text-[10px] font-extrabold px-2 py-1 rounded-md text-white truncate transition transform hover:scale-102 cursor-pointer"
                                :title="`Môn: ${task.subject?.name} - ${task.title}`">
                                {{ task.title }}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue'

const tasks = ref([])
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return { headers: { Authorization: `Bearer ${token}` } }
}

// Gọi API do Hùng Nguyễn viết bên Backend để lấy toàn bộ deadline bài tập
const fetchDeadlines = async () => {
    try {
        const res = await axios.get('http://localhost:8000/api/calendar/deadlines', getAuthHeaders())
        tasks.value = res.data
    } catch (error) {
        console.error('Lỗi lấy dữ liệu lịch hạn chót:', error)
    }
}

// Thuật toán tính toán số ô ngày trống ở đầu lịch của tháng cũ
const blankDays = computed(() => {
    const firstDayIndex = new Date(currentYear.value, currentMonth.value, 1).getDay()
    return firstDayIndex
})

// Tính toán tổng số ngày nằm trong tháng hiện tại
const daysInMonth = computed(() => {
    return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Điều hướng chuyển tháng tới / lui
const changeMonth = (direction) => {
    currentMonth.value += direction
    if (currentMonth.value < 0) {
        currentMonth.value = 11
        currentYear.value--
    } else if (currentMonth.value > 11) {
        currentMonth.value = 0
        currentYear.value++
    }
}

// Lọc các nhiệm vụ trùng khớp với con số ngày hiển thị trên ô lịch
const getTasksForDate = (date) => {
    const formattedMonth = String(currentMonth.value + 1).padStart(2, '0')
    const formattedDate = String(date).padStart(2, '0')
    const targetString = `${currentYear.value}-${formattedMonth}-${formattedDate}`
    return tasks.value.filter(task => task.due_date === targetString)
}

// Map nhãn màu sắc đồng bộ hoàn hảo với bảng Kanban bên ngoài
const getLabelColorClass = (color) => {
    const classes = {
        blue: 'bg-blue-500 hover:bg-blue-600',
        red: 'bg-red-500 hover:bg-red-600',
        green: 'bg-green-500 hover:bg-green-600',
        amber: 'bg-amber-500 hover:bg-amber-600',
        purple: 'bg-purple-500 hover:bg-purple-600'
    }
    return classes[color] || classes.blue
}

onMounted(() => {
    fetchDeadlines()
})
</script>