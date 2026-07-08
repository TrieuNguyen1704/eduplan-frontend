<template>
  <div class="min-h-screen bg-slate-50 p-6 md:p-10">
    <div class="max-w-6xl mx-auto" v-if="subject">
      <!-- Điều hướng back -->
      <button 
        @click="$router.push('/subjects')" 
        class="text-slate-400 hover:text-slate-600 text-sm font-medium mb-6 flex items-center gap-2 transition"
      >
        <span>← Quay lại danh sách môn</span>
      </button>

      <!-- Banner Môn học (Header Workspace) -->
      <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8 flex justify-between items-start">
        <div>
          <span class="px-3.5 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl uppercase tracking-wider">
            {{ subject.code || 'HỌC PHẦN' }}
          </span>
          <h1 class="text-3xl font-black text-slate-800 mt-3">{{ subject.name }}</h1>
          <p class="text-slate-400 text-sm mt-1">Không gian lưu trữ tài liệu & ghi chú bài giảng</p>
        </div>
        <div class="text-right">
          <span class="text-xs text-slate-400 font-semibold block">TÍN CHỈ</span>
          <span class="text-2xl font-black text-slate-700">{{ subject.credits }}</span>
        </div>
      </div>

      <!-- Khu vực chính: Ghi chú & Tài liệu -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Cột trái: Form thêm mới -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-6">
            <h3 class="font-bold text-slate-800 text-lg mb-4">📌 Ghim tài liệu / Ghi chú</h3>
            <form @submit.prevent="createNote" class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Phân loại</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    @click="form.type = 'note'"
                    :class="form.type === 'note' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600'"
                    class="py-2 rounded-xl text-xs transition"
                  >
                    📝 Ghi chú
                  </button>
                  <button 
                    type="button" 
                    @click="form.type = 'link'"
                    :class="form.type === 'link' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-600'"
                    class="py-2 rounded-xl text-xs transition"
                  >
                    🔗 Link tài liệu
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tiêu đề (*)</label>
                <input 
                  v-model="form.title" 
                  type="text" required
                  placeholder="VD: Slide Chương 1, Dàn ý ôn thi..." 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div v-if="form.type === 'link'">
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Đường dẫn (URL)</label>
                <input 
                  v-model="form.url" 
                  type="url" 
                  placeholder="https://drive.google.com/..." 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nội dung / Ghi chú nhanh</label>
                <textarea 
                  v-model="form.content" 
                  rows="4"
                  placeholder="Ghi chú ý chính, password mở file..." 
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm shadow-sm transition"
              >
                + Thêm vào Workspace
              </button>
            </form>
          </div>
        </div>

        <!-- Cột phải: Danh sách Ghi chú / Link (Grid cards) -->
        <div class="lg:col-span-2 space-y-4">
          <div v-if="subject.notes && subject.notes.length === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <div class="text-4xl mb-3">📭</div>
            <p class="text-slate-500 font-medium">Chưa có tài liệu hay ghi chú nào.</p>
            <p class="text-slate-400 text-xs mt-1">Anh hãy dùng form bên trái để ghim tài liệu đầu tiên nhen!</p>
          </div>

          <div 
            v-for="note in subject.notes" 
            :key="note.id"
            class="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition relative group"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                <span v-if="note.type === 'link'" class="text-lg">🔗</span>
                <span v-else class="text-lg">📝</span>
                <h4 class="font-bold text-slate-800 text-base">{{ note.title }}</h4>
              </div>
              <button 
                @click="deleteNote(note.id)"
                class="text-slate-300 hover:text-red-500 transition px-2 text-sm"
                title="Xóa"
              >✕</button>
            </div>

            <!-- Nếu là link thì hiện nút mở link -->
            <div v-if="note.url" class="mb-3">
              <a 
                :href="note.url" 
                target="_blank" 
                class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                <span>Mở tài liệu đính kèm ↗</span>
              </a>
            </div>

            <!-- Nội dung text -->
            <p v-if="note.content" class="text-slate-600 text-sm whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {{ note.content }}
            </p>
            <span class="text-[11px] text-slate-400 block mt-3">Đã tạo: {{ new Date(note.created_at).toLocaleDateString('vi-VN') }}</span>
          </div>
        </div>

      </div>
    </div>
    
    <div v-else class="text-center py-20 text-slate-400">Đang tải không gian làm việc...</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const subject = ref(null)

const form = reactive({
  title: '',
  content: '',
  type: 'note',
  url: ''
})

// DÙNG CHUẨN XÁC 'access_token' ĐỂ KHÔNG BỊ LỖI UNAUTHENTICATED
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

const fetchWorkspace = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/subjects/${route.params.id}/workspace`, getAuthHeaders())
    subject.value = res.data
  } catch (error) {
    console.error('Lỗi tải workspace:', error)
  }
}

const createNote = async () => {
  try {
    await axios.post('http://localhost:8000/api/notes', {
      subject_id: route.params.id,
      ...form
    }, getAuthHeaders())
    
    // Reset form và tải lại dữ liệu
    form.title = ''
    form.content = ''
    form.url = ''
    fetchWorkspace()
  } catch (error) {
    alert('Không thể lưu tài liệu. Anh kiểm tra lại nhé!')
  }
}

const deleteNote = async (id) => {
  if (!confirm('Anh có chắc muốn xóa mục này không?')) return
  try {
    await axios.delete(`http://localhost:8000/api/notes/${id}`, getAuthHeaders())
    fetchWorkspace()
  } catch (error) {
    alert('Lỗi khi xóa!')
  }
}

onMounted(() => {
  fetchWorkspace()
})
</script>