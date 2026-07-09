<template>
    <MainLayout>
        <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">

            <!-- HEADER BANNER -->
            <div
                class="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h1 class="text-3xl font-black flex items-center gap-2">
                        <span>⏱️ Phòng Tập Trung Pomodoro</span>
                        <span
                            class="text-xs bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Focus
                            Mode</span>
                    </h1>
                    <p class="text-rose-100 text-sm mt-1">Quản lý năng lượng, đánh bại xao nhãng và rèn luyện kỷ律 học
                        tập đỉnh cao</p>
                </div>

                <!-- Thống kê nhanh hôm nay -->
                <div class="flex gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15">
                    <div class="text-center">
                        <div class="text-2xl font-black">{{ stats.today_sessions }}</div>
                        <div class="text-[11px] font-bold text-rose-200 uppercase tracking-wider">Phiên hôm nay</div>
                    </div>
                    <div class="w-px bg-white/20"></div>
                    <div class="text-center">
                        <div class="text-2xl font-black">{{ stats.today_minutes }} <span
                                class="text-xs font-normal">phút</span></div>
                        <div class="text-[11px] font-bold text-rose-200 uppercase tracking-wider">Thời gian học</div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- ================= KHU VỰC ĐỒNG HỒ CHÍNH (2 CỘT) ================= -->
                <div
                    class="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs flex flex-col items-center justify-between min-h-[480px] relative overflow-hidden">

                    <!-- Dải màu trạng thái -->
                    <div :class="modeColors[currentMode].bar"
                        class="absolute top-0 left-0 right-0 h-2 transition-colors duration-500"></div>

                    <!-- 3 Nút chọn chế độ -->
                    <div class="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                        <button v-for="(label, key) in modes" :key="key" @click="switchMode(key)" :disabled="isRunning"
                            :class="currentMode === key ? modeColors[key].btn + ' text-white font-extrabold shadow-md' : 'text-slate-500 hover:text-slate-800 font-bold'"
                            class="px-5 py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50">
                            {{ label }}
                        </button>
                    </div>

                    <!-- ĐỒNG HỒ SỐ KHỔ LỚN -->
                    <div class="my-auto text-center my-8">
                        <div :class="modeColors[currentMode].text"
                            class="text-7xl sm:text-8xl font-black tracking-tighter font-mono transition-colors duration-500 select-none">
                            {{ formattedTime }}
                        </div>
                        <p class="text-xs font-extrabold text-slate-400 uppercase tracking-widest mt-2">
                            {{ isRunning ? '🔥 Đang tập trung cao độ...' : '⏸️ Đồng hồ đang tạm dừng' }}
                        </p>
                    </div>

                    <!-- Chọn môn học để gắn nhãn -->
                    <div class="w-full max-w-xs mb-6">
                        <label
                            class="block text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 text-center">
                            📚 Gãn nhãn môn học cho phiên này:
                        </label>
                        <select v-model="selectedSubject" :disabled="isRunning"
                            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-500 disabled:opacity-50 text-center cursor-pointer">
                            <option :value="null">-- Không gắn nhãn môn học --</option>
                            <option v-for="sub in subjects" :key="sub.id" :value="sub.id">
                                {{ sub.code }} - {{ sub.name }}
                            </option>
                        </select>
                    </div>

                    <!-- CÁC NÚT ĐIỀU KHIỂN (START / PAUSE / RESET) -->
                    <div class="flex gap-4 w-full max-w-xs">
                        <button @click="toggleTimer"
                            :class="isRunning ? 'bg-amber-500 hover:bg-amber-600' : modeColors[currentMode].btn"
                            class="flex-1 py-4 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition text-sm cursor-pointer uppercase tracking-wider">
                            {{ isRunning ? '⏸️ Tạm Dừng' : '▶️ Bắt Đầu' }}
                        </button>
                        <button @click="resetTimer"
                            class="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold rounded-2xl transition text-sm cursor-pointer"
                            title="Khôi phục thời gian">
                            🔄
                        </button>
                    </div>

                </div>

                <!-- ================= KHU VỰC LỊCH SỬ & MẸO (1 CỘT) ================= -->
                <div class="lg:col-span-1 space-y-6">

                    <!-- Danh sách phiên vừa học -->
                    <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
                        <h3 class="font-black text-slate-800 text-sm flex items-center justify-between">
                            <span>🏆 Lịch sử tập trung</span>
                            <span class="text-[10px] font-extrabold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg">Hôm
                                nay</span>
                        </h3>

                        <div v-if="stats.recent_sessions.length === 0"
                            class="text-center py-8 text-slate-400 text-xs font-bold">
                            Chưa có phiên nào hoàn thành. <br />Hãy bắt đầu Pomodoro đầu tiên nhé!
                        </div>

                        <div v-else class="space-y-3">
                            <div v-for="session in stats.recent_sessions" :key="session.id"
                                class="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                                <div class="space-y-0.5">
                                    <div class="font-black text-slate-800">
                                        {{ session.subject ? session.subject.code : 'Tự do / General' }}
                                    </div>
                                    <div class="text-[10px] text-slate-400 font-semibold">
                                        {{ new Date(session.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                        minute:'2-digit'}) }}
                                    </div>
                                </div>
                                <div
                                    class="font-extrabold text-rose-600 bg-white px-3 py-1 rounded-xl shadow-2xs border border-rose-100">
                                    +{{ session.duration_minutes }}p
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mẹo học tập CDIO -->
                    <div
                        class="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md space-y-3">
                        <div class="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                            <span>💡 Mẹo hiệu suất CDIO</span>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed font-medium">
                            Trong 25 phút Pomodoro, hãy tắt thông báo điện thoại và chỉ tập trung vào đúng **1 nhiệm vụ
                            duy nhất**. Khi chuông reo, bắt buộc phải đứng dậy đi lại 5 phút nhé!
                        </p>
                    </div>

                </div>

            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue'

// Cấu hình thời gian (Số giây)
const DURATIONS = {
    work: 25 * 60,        // 25 phút
    short_break: 5 * 60,  // 5 phút
    long_break: 15 * 60   // 15 phút
}

const modes = {
    work: '🍅 Pomodoro (25p)',
    short_break: '☕ Nghỉ ngắn (5p)',
    long_break: '🛋️ Nghỉ dài (15p)'
}

const modeColors = {
    work: { bar: 'bg-rose-500', text: 'text-rose-600', btn: 'bg-rose-600 hover:bg-rose-700' },
    short_break: { bar: 'bg-emerald-500', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700' },
    long_break: { bar: 'bg-blue-500', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' }
}

const currentMode = ref('work')
const timeLeft = ref(DURATIONS.work)
const isRunning = ref(false)
let timerInterval = null

const subjects = ref([])
const selectedSubject = ref(null)
const stats = ref({ today_minutes: 0, today_sessions: 0, recent_sessions: [] })

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
})

// Định danh thời gian MM:SS
const formattedTime = computed(() => {
    const mins = Math.floor(timeLeft.value / 60)
    const secs = timeLeft.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

// Chuyển chế độ
const switchMode = (mode) => {
    if (isRunning.value) return
    currentMode.value = mode
    timeLeft.value = DURATIONS[mode]
}

// Bắt đầu / Tạm dừng
const toggleTimer = () => {
    if (isRunning.value) {
        clearInterval(timerInterval)
        isRunning.value = false
    } else {
        isRunning.value = true
        timerInterval = setInterval(() => {
            if (timeLeft.value > 0) {
                timeLeft.value--
            } else {
                // Hết giờ!
                clearInterval(timerInterval)
                isRunning.value = false
                playAlarm()
                if (currentMode.value === 'work') {
                    saveSession()
                } else {
                    alert('⏰ Đã hết giờ nghỉ! Quay lại bàn học thôi anh Nguyên ơi!')
                }
            }
        }, 1000)
    }
}

// Khôi phục lại thời gian
const resetTimer = () => {
    clearInterval(timerInterval)
    isRunning.value = false
    timeLeft.value = DURATIONS[currentMode.value]
}

// 🔊 Phát tiếng chuông báo thức bằng Web Audio API (Không cần tải file mp3)
const playAlarm = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(587.33, ctx.currentTime) // Nốt D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5) // Nốt A5

        gain.gain.setValueAtTime(0.5, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start()
        osc.stop(ctx.currentTime + 1.2)
    } catch (e) {
        console.log('Audio error:', e)
    }
}

// 💾 Gọi API lưu phiên học thành công
const saveSession = async () => {
    try {
        const durationMins = Math.round(DURATIONS[currentMode.value] / 60)
        await axios.post('http://localhost:8000/api/pomodoro', {
            subject_id: selectedSubject.value,
            duration_minutes: durationMins,
            mode: currentMode.value
        }, getAuthHeaders())

        alert(`🎉 Chúc mừng! Anh đã hoàn thành xuất sắc ${durationMins} phút tập trung!`)
        fetchStats() // Tải lại thống kê
    } catch (err) {
        console.error('Lỗi lưu Pomodoro:', err)
    }
}

// Tải danh sách môn học và thống kê
const fetchData = async () => {
    try {
        const [subRes, statsRes] = await Promise.all([
            axios.get('http://localhost:8000/api/subjects', getAuthHeaders()),
            axios.get('http://localhost:8000/api/pomodoro', getAuthHeaders())
        ])
        subjects.value = subRes.data
        stats.value = statsRes.data
    } catch (err) {
        console.error('Lỗi tải dữ liệu Pomodoro:', err)
    }
}

onMounted(() => {
    fetchData()
})

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
/* Font chữ số chuẩn đồng hồ */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&display=swap');

.font-mono {
    font-family: 'JetBrains Mono', monospace;
}
</style>