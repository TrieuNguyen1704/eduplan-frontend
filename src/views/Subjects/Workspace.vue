<template>
  <MainLayout>
    <div class="max-w-6xl mx-auto" v-if="subject">
      <button @click="$router.push('/subjects')"
        class="text-slate-400 hover:text-slate-600 text-sm font-medium mb-6 flex items-center gap-2 transition cursor-pointer">
        <span>← Quay lại danh sách môn</span>
      </button>

      <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8 flex justify-between items-start">
        <div>
          <span class="px-3.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl uppercase tracking-wider">
            {{ subject.code || 'HỌC PHẦN' }}
          </span>
          <h1 class="text-3xl font-black text-slate-800 mt-3">{{ subject.name }}</h1>
          <p class="text-slate-400 text-sm mt-1">Bấm vào từng thẻ bên dưới để mở Hộp thoại chi tiết (Upload tài liệu,
            cập nhật tiến độ...)</p>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-400 font-semibold block">TÍN CHỈ</span>
          <span class="text-2xl font-black text-slate-700">{{ subject.credits }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-6">
            <h3 class="font-bold text-slate-800 text-base mb-3">⚡ Tạo thẻ nhanh</h3>
            <form @submit.prevent="createCard" class="space-y-3">
              <input v-model="quickTitle" type="text" required placeholder="VD: Slide Chương 1, Bài tập nhóm..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-medium" />
              <button type="submit"
                class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm shadow-sm transition flex justify-center items-center gap-1 cursor-pointer">
                <span>+ Thêm thẻ mới</span>
              </button>
            </form>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-3">
          <div v-if="subject.notes && subject.notes.length === 0"
            class="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <div class="text-4xl mb-3">📭</div>
            <p class="text-slate-500 font-medium">Chưa có thẻ nào được tạo.</p>
            <p class="text-slate-400 text-xs mt-1">Anh nhập tên ở form bên trái rồi bấm "+ Thêm thẻ mới" nhen!</p>
          </div>

          <div v-for="note in subject.notes" :key="note.id" @click="openDetailModal(note)"
            class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex justify-between items-center group relative overflow-hidden">
            <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getColorClass(note.label_color)"></div>

            <div class="flex-1 pl-2 pr-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full"
                  :class="note.progress === 100 ? 'bg-green-500' : (note.progress > 0 ? 'bg-amber-500' : 'bg-slate-300')"></span>
                <h4 class="font-bold text-slate-800 text-base group-hover:text-blue-600 transition">{{ note.title }}
                </h4>
              </div>

              <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                <span v-if="note.file_name"
                  class="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg font-semibold">
                  📎 {{ note.file_name }}
                </span>
                <span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">📊 Tiến độ: {{ note.progress || 0
                  }}%</span>
                <span v-if="note.due_date" class="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">📅 Hạn: {{
                  note.due_date }}</span>
              </div>
            </div>

            <button @click.stop="deleteCard(note.id)"
              class="text-slate-300 hover:text-red-500 transition p-2 text-sm cursor-pointer"
              title="Xóa thẻ này">✕</button>
          </div>
        </div>

      </div>
    </div>

    <div v-else class="text-center py-20 text-slate-400">Đang tải không gian làm việc...</div>

    <div v-if="activeCard"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        class="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">

        <div class="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
          <div class="flex-1 pr-4">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Chi tiết thẻ nhiệm
              vụ</span>
            <input v-model="editForm.title" type="text"
              class="text-2xl font-black text-slate-800 w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none transition py-1" />
          </div>
          <button @click="activeCard = null"
            class="text-slate-400 hover:text-slate-600 text-xl p-1 font-bold cursor-pointer">✕</button>
        </div>

        <div class="space-y-6">

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">🏷️ Nhãn màu nhận diện</label>
            <div class="flex gap-2">
              <button v-for="color in ['blue', 'red', 'green', 'amber', 'purple']" :key="color" type="button"
                @click="editForm.label_color = color"
                :class="[getColorClass(color), editForm.label_color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-105' : 'opacity-60 hover:opacity-100']"
                class="w-8 h-6 rounded-lg transition cursor-pointer"></button>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div class="flex justify-between items-center mb-2">
              <label class="text-xs font-bold text-slate-600 uppercase flex items-center gap-1.5">
                <span>📊 Đánh giá tiến độ hoàn thành</span>
              </label>
              <span class="text-sm font-black text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-lg">{{ editForm.progress
                }}%</span>
            </div>
            <input type="range" v-model="editForm.progress" min="0" max="100" step="5"
              class="w-full accent-blue-600 cursor-pointer" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-2">📎 Tài liệu đính kèm (Slide, PDF,
              Word...)</label>

            <div v-if="activeCard.file_name"
              class="flex items-center justify-between p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl mb-3">
              <div class="flex items-center gap-2.5 overflow-hidden">
                <span class="text-2xl">📄</span>
                <div class="truncate">
                  <p class="text-sm font-bold text-slate-700 truncate">{{ activeCard.file_name }}</p>
                  <p class="text-[11px] text-slate-400">Đã lưu trữ trong hệ thống</p>
                </div>
              </div>
              <a :href="`http://localhost:8000/storage/${activeCard.file_path}`" target="_blank"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shrink-0">
                Tải / Mở file ↗
              </a>
            </div>

            <input type="file" @change="handleFileUpload"
              class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-200 rounded-xl p-1.5 transition" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">📅 Ngày hạn chót (Deadline)</label>
              <input type="date" v-model="editForm.due_date"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm text-slate-700 font-medium" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">📌 Trạng thái</label>
              <select v-model="editForm.status"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm text-slate-700 font-medium cursor-pointer">
                <option value="todo">⚪ Cần làm (To-do)</option>
                <option value="doing">🟡 Đang thực hiện (Doing)</option>
                <option value="done">🟢 Đã hoàn thành (Done)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">📝 Mô tả / Ghi chú chi tiết</label>
            <textarea v-model="editForm.content" rows="5"
              placeholder="Thêm mô tả chi tiết, ghi chú bài giảng hay dặn dò cho nhiệm vụ này..."
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm text-slate-700 resize-none leading-relaxed"></textarea>
          </div>

        </div>

        <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
          <button @click="activeCard = null"
            class="px-5 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold text-sm transition cursor-pointer">
            Đóng
          </button>
          <button @click="saveCardDetail" :disabled="saving"
            class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer">
            <span>{{ saving ? 'Đang lưu trữ...' : 'Lưu thay đổi' }}</span>
          </button>
        </div>

      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue'

const route = useRoute()
const subject = ref(null)
const quickTitle = ref('')
const activeCard = ref(null)
const selectedFile = ref(null)
const saving = ref(false)

const editForm = reactive({
  title: '',
  content: '',
  progress: 0,
  due_date: '',
  status: 'todo',
  label_color: 'blue'
})

// DÙNG CHUẨN XÁC 'access_token' ĐỂ KHÔNG BỊ LỖI UNAUTHENTICATED
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

// Bộ màu sắc nhãn nhận diện
const getColorClass = (color) => {
  const colors = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500'
  }
  return colors[color] || colors.blue
}

const fetchWorkspace = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/subjects/${route.params.id}/workspace`, getAuthHeaders())
    subject.value = res.data
  } catch (error) {
    console.error('Lỗi tải workspace:', error)
  }
}

// 1. Tạo thẻ nhanh bên ngoài
const createCard = async () => {
  if (!quickTitle.value.trim()) return
  try {
    await axios.post('http://localhost:8000/api/notes', {
      subject_id: route.params.id,
      title: quickTitle.value
    }, getAuthHeaders())

    quickTitle.value = ''
    fetchWorkspace()
  } catch (error) {
    alert('Không thể tạo thẻ mới. Anh kiểm tra lại kết nối nhé!')
  }
}

// 2. Mở Modal Chi Tiết Thẻ
const openDetailModal = (note) => {
  activeCard.value = note
  editForm.title = note.title
  editForm.content = note.content || ''
  editForm.progress = note.progress || 0
  editForm.due_date = note.due_date || ''
  editForm.status = note.status || 'todo'
  editForm.label_color = note.label_color || 'blue'
  selectedFile.value = null
}

// Xử lý khi chọn file upload
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

// 3. Lưu chi tiết thẻ (Bao gồm upload file nếu có)
const saveCardDetail = async () => {
  if (!activeCard.value) return
  saving.value = true

  try {
    const formData = new FormData()
    formData.append('_method', 'PUT') // Lách luật Laravel để gửi FormData qua lệnh PUT
    formData.append('title', editForm.title)
    formData.append('content', editForm.content)
    formData.append('progress', editForm.progress)
    formData.append('status', editForm.status)
    formData.append('label_color', editForm.label_color)
    if (editForm.due_date) formData.append('due_date', editForm.due_date)
    if (selectedFile.value) formData.append('file', selectedFile.value)

    const token = localStorage.getItem('access_token')
    await axios.post(`http://localhost:8000/api/notes/${activeCard.value.id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    activeCard.value = null
    fetchWorkspace() // Tải lại danh sách sau khi lưu thành công
  } catch (error) {
    alert('Lỗi khi lưu thay đổi!')
    console.error(error)
  } finally {
    saving.value = false
  }
}

// 4. Xóa thẻ
const deleteCard = async (id) => {
  if (!confirm('Anh có chắc muốn xóa thẻ nhiệm vụ này không?')) return
  try {
    await axios.delete(`http://localhost:8000/api/notes/${id}`, getAuthHeaders())
    fetchWorkspace()
  } catch (error) {
    alert('Lỗi khi xóa thẻ!')
  }
}

onMounted(() => {
  fetchWorkspace()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in>div {
  animation: fadeIn 0.15s ease-out forwards;
}
</style>