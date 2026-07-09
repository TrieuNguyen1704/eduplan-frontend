<template>
    <MainLayout>
        <div class="space-y-8 animate-fade-in">

            <!-- HEADER BANNER -->
            <div
                class="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h1 class="text-3xl font-black flex items-center gap-2">
                        <span>📇 Flashcard AI Studio</span>
                        <span
                            class="text-xs bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Gemini
                            2.5</span>
                    </h1>
                    <p class="text-purple-100 text-sm mt-1">Học tập thông minh với thẻ ghi nhớ 3D và Trợ lý AI tự động
                        giải nghĩa từ khóa</p>
                </div>

                <button v-if="!activeDeck" @click="showCreateModal = true"
                    class="px-6 py-3 bg-white text-purple-600 font-extrabold rounded-2xl shadow-lg hover:bg-purple-50 transition text-sm whitespace-nowrap cursor-pointer">
                    + Tạo Bộ Thẻ Mới
                </button>
                <button v-else @click="activeDeck = null"
                    class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-extrabold rounded-2xl transition text-sm whitespace-nowrap cursor-pointer">
                    ➔ Quay lại danh sách Bộ thẻ
                </button>
            </div>

            <!-- ================= 1. MÀN HÌNH DANH SÁCH BỘ THÉ (DECKS) ================= -->
            <div v-if="!activeDeck" class="space-y-6">
                <div v-if="loadingDecks" class="text-center py-12 text-slate-400 font-medium">Đang tải dữ liệu bộ thẻ...
                </div>

                <div v-else-if="decks.length === 0"
                    class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs">
                    <div class="text-5xl mb-3">📭</div>
                    <p class="text-slate-600 font-bold text-lg">Anh chưa có bộ thẻ Flashcard nào.</p>
                    <p class="text-slate-400 text-xs mt-1">Hãy bấm nút "+ Tạo Bộ Thẻ Mới" ở góc trên để bắt đầu học tập
                        nhé!</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="deck in decks" :key="deck.id" @click="selectDeck(deck.id)"
                        class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between h-48 relative overflow-hidden">
                        <!-- Dải màu trang trí -->
                        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500">
                        </div>

                        <div>
                            <div class="flex justify-between items-start mt-2">
                                <span
                                    class="text-[11px] font-extrabold px-3 py-1 bg-purple-50 text-purple-600 rounded-lg">
                                    {{ deck.cards_count || 0 }} thẻ nhớ
                                </span>
                                <button @click.stop="deleteDeck(deck.id)"
                                    class="text-slate-300 hover:text-red-500 transition text-sm font-bold px-2 py-0.5"
                                    title="Xóa bộ thẻ này">✕</button>
                            </div>
                            <h3
                                class="font-black text-slate-800 mt-3 group-hover:text-purple-600 transition text-lg line-clamp-1">
                                {{ deck.title }}
                            </h3>
                            <p class="text-slate-400 text-xs mt-1 line-clamp-2">{{ deck.description || 'Chưa có mô tả'
                            }}</p>
                        </div>

                        <div
                            class="border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-bold text-purple-600">
                            <span>Bắt đầu học ngay</span>
                            <span class="group-hover:translate-x-1 transition">➔</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= 2. MÀN HÌNH CHI TIẾT & HỌC THẺ 3D (ACTIVE DECK) ================= -->
            <div v-else class="space-y-8">
                <!-- Tab navigation -->
                <div class="flex justify-center border-b border-slate-200">
                    <div class="flex gap-4">
                        <button @click="studyMode = true"
                            :class="studyMode ? 'border-purple-600 text-purple-600 font-black' : 'border-transparent text-slate-400 font-bold'"
                            class="pb-3 border-b-2 text-sm transition cursor-pointer px-4">
                            🎓 Phòng Học Lật Thẻ 3D ({{ currentDeckData?.cards?.length || 0 }})
                        </button>
                        <button @click="studyMode = false"
                            :class="!studyMode ? 'border-purple-600 text-purple-600 font-black' : 'border-transparent text-slate-400 font-bold'"
                            class="pb-3 border-b-2 text-sm transition cursor-pointer px-4">
                            ⚙️ Thêm Thẻ & Trợ Lý AI
                        </button>
                    </div>
                </div>

                <!-- CHẾ ĐỘ 1: PHÒNG HỌC LẬT THẺ 3D -->
                <div v-if="studyMode" class="max-w-xl mx-auto text-center space-y-6">
                    <div v-if="!currentDeckData?.cards || currentDeckData.cards.length === 0"
                        class="bg-white p-12 rounded-3xl border border-slate-100 shadow-xs">
                        <p class="text-slate-500 font-bold">Bộ thẻ này hiện chưa có từ khóa nào.</p>
                        <button @click="studyMode = false"
                            class="mt-4 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md">
                            Chuyển sang tab "Thêm Thẻ & Trợ Lý AI" ➔
                        </button>
                    </div>

                    <div v-else class="space-y-6">
                        <!-- Thẻ 3D Flip Card -->
                        <div @click="isFlipped = !isFlipped"
                            class="w-full h-80 cursor-pointer perspective-1000 select-none group">
                            <div :class="isFlipped ? 'rotate-y-180' : ''"
                                class="w-full h-full relative transition-transform duration-500 transform-style-3d shadow-xl rounded-3xl border border-slate-200/80 bg-white">
                                <!-- MẶT TRƯỚC (FRONT) -->
                                <div
                                    class="absolute inset-0 w-full h-full backface-hidden p-8 flex flex-col justify-between items-center bg-gradient-to-br from-white to-slate-50 rounded-3xl">
                                    <span
                                        class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                        Mặt trước (Câu hỏi / Từ khóa)
                                    </span>
                                    <div class="text-2xl sm:text-3xl font-black text-slate-800 px-4">
                                        {{ currentCard?.front }}
                                    </div>
                                    <span class="text-xs font-semibold text-purple-500 group-hover:underline">💡 Click
                                        để lật xem đáp án</span>
                                </div>

                                <!-- MẶT SAU (BACK) -->
                                <div
                                    class="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-8 flex flex-col justify-between items-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl">
                                    <span
                                        class="text-[10px] font-extrabold uppercase tracking-widest text-purple-200 bg-white/10 px-3 py-1 rounded-full">
                                        Mặt sau (Định nghĩa / Giải thích)
                                    </span>
                                    <!-- THÊM CLASS whitespace-pre-line VÀO ĐÂY -->
                                    <div
                                        class="text-sm sm:text-base font-medium leading-relaxed px-4 overflow-y-auto max-h-48 text-left w-full whitespace-pre-line">
                                        {{ currentCard?.back }}
                                    </div>
                                    <span class="text-xs font-semibold text-purple-200">🔄 Click để quay lại mặt
                                        trước</span>
                                </div>
                            </div>
                        </div>

                        <!-- Thanh điều khiển lật thẻ -->
                        <div
                            class="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
                            <button @click="prevCard" :disabled="currentIndex === 0"
                                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-xl font-bold text-xs text-slate-700 transition cursor-pointer">
                                ◀ Thẻ trước
                            </button>

                            <span class="text-xs font-extrabold text-slate-600">
                                Thẻ {{ currentIndex + 1 }} / {{ currentDeckData.cards.length }}
                            </span>

                            <button @click="nextCard" :disabled="currentIndex === currentDeckData.cards.length - 1"
                                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-xl font-bold text-xs text-slate-700 transition cursor-pointer">
                                Thẻ tiếp ▶
                            </button>
                        </div>
                    </div>
                </div>

                <!-- CHẾ ĐỘ 2: THÊM THẺ & TRỢ LÝ AI -->
                <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Form nhập liệu & Gọi AI -->
                    <div
                        class="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4 h-fit sticky top-24">
                        <h3 class="font-black text-slate-800 text-base flex items-center gap-2">
                            <span>✨ Thêm Thẻ Nhớ Mới</span>
                        </h3>

                        <form @submit.prevent="addCard" class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mặt trước (Khái
                                    niệm / Từ khóa) (*)</label>
                                <input v-model="newFront" type="text" required placeholder="VD: Phản xạ có điều kiện"
                                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-xs font-bold text-slate-800" />
                            </div>

                            <!-- NÚT GỌI AI GEMINI THẦN THÁNH -->
                            <div class="pt-1">
                                <button type="button" @click="generateAi" :disabled="!newFront || aiLoading"
                                    class="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer">
                                    <span>{{ aiLoading ? '🤖 Gemini đang suy nghĩ...' : '🤖 AI Gợi Ý Định Nghĩa Tự Động'
                                    }}</span>
                                </button>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mặt sau (Giải thích
                                    / Định nghĩa) (*)</label>
                                <textarea v-model="newBack" required rows="4"
                                    placeholder="Tự nhập hoặc bấm nút AI ở trên để tự điền..."
                                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-xs font-medium text-slate-700 leading-relaxed"></textarea>
                            </div>

                            <button type="submit" :disabled="cardSubmitting"
                                class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer">
                                + Lưu Thẻ Nhớ Vào Bộ
                            </button>
                        </form>
                    </div>

                    <!-- Danh sách các thẻ hiện có -->
                    <div class="lg:col-span-2 space-y-4">
                        <h3 class="font-black text-slate-800 text-base">Danh sách thẻ trong bộ ({{
                            currentDeckData?.cards?.length || 0 }})</h3>

                        <div v-if="!currentDeckData?.cards || currentDeckData.cards.length === 0"
                            class="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400 text-xs font-bold">
                            Chưa có thẻ nào. Hãy thêm thẻ đầu tiên ở form bên trái!
                        </div>

                        <div v-else class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            <div v-for="(card, idx) in currentDeckData.cards" :key="card.id"
                                class="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex justify-between items-start gap-4 hover:border-purple-200 transition">
                                <div class="space-y-1 flex-1">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">#{{
                                                idx + 1 }}</span>
                                        <h4 class="font-black text-slate-800 text-sm">{{ card.front }}</h4>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed pl-7 text-left whitespace-pre-line ">{{ card.back }}</p>
                                </div>

                                <button @click="deleteCard(card.id)"
                                    class="text-slate-300 hover:text-red-500 font-bold px-2 py-1 text-xs transition"
                                    title="Xóa thẻ này">🗑️</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= MODAL TẠO BỘ THẺ MỚI ================= -->
            <div v-if="showCreateModal"
                class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
                <div class="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
                    <h3 class="text-lg font-black text-slate-800">📇 Tạo Bộ Thẻ Flashcard Mới</h3>

                    <form @submit.prevent="createDeck" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Tên bộ thẻ (*)</label>
                            <input v-model="deckTitle" type="text" required
                                placeholder="VD: Tâm lý học hành vi / Từ vựng IELTS..."
                                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-xs font-bold" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Mô tả ngắn</label>
                            <textarea v-model="deckDesc" rows="2" placeholder="Ghi chú về chủ đề học tập này..."
                                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 text-xs"></textarea>
                        </div>
                        <div class="flex justify-end gap-2 pt-2">
                            <button type="button" @click="showCreateModal = false"
                                class="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-xs cursor-pointer">Hủy</button>
                            <button type="submit" :disabled="deckSubmitting"
                                class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer">Tạo
                                Bộ Thẻ ✓</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MainLayout from '../../components/MainLayout.vue'

const decks = ref([])
const loadingDecks = ref(true)
const activeDeck = ref(null)
const currentDeckData = ref(null)

// Modal Tạo Deck
const showCreateModal = ref(false)
const deckTitle = ref('')
const deckDesc = ref('')
const deckSubmitting = ref(false)

// Chế độ học & Lật thẻ
const studyMode = ref(true)
const currentIndex = ref(0)
const isFlipped = ref(false)
const currentCard = ref(null)

// Form thêm thẻ & AI
const newFront = ref('')
const newBack = ref('')
const aiLoading = ref(false)
const cardSubmitting = ref(false)

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
})

// 1. Tải danh sách Decks
const fetchDecks = async () => {
    try {
        loadingDecks.value = true
        const res = await axios.get('http://localhost:8000/api/flashcards/decks', getAuthHeaders())
        decks.value = res.data
    } catch (err) {
        console.error('Lỗi tải Decks:', err)
    } finally {
        loadingDecks.value = false
    }
}

// 2. Tạo Deck mới
const createDeck = async () => {
    try {
        deckSubmitting.value = true
        await axios.post('http://localhost:8000/api/flashcards/decks', {
            title: deckTitle.value,
            description: deckDesc.value
        }, getAuthHeaders())
        showCreateModal.value = false
        deckTitle.value = ''
        deckDesc.value = ''
        fetchDecks()
    } catch (err) {
        alert('Lỗi tạo bộ thẻ!')
    } finally {
        deckSubmitting.value = false
    }
}

// 3. Chọn Deck & Vào phòng học
const selectDeck = async (id) => {
    try {
        activeDeck.value = id
        const res = await axios.get(`http://localhost:8000/api/flashcards/decks/${id}`, getAuthHeaders())
        currentDeckData.value = res.data
        currentIndex.value = 0
        isFlipped.value = false
        updateCurrentCard()
    } catch (err) {
        alert('Lỗi tải chi tiết bộ thẻ!')
    }
}

const updateCurrentCard = () => {
    if (currentDeckData.value?.cards && currentDeckData.value.cards.length > 0) {
        currentCard.value = currentDeckData.value.cards[currentIndex.value]
    } else {
        currentCard.value = null
    }
}

const nextCard = () => {
    if (currentIndex.value < currentDeckData.value.cards.length - 1) {
        isFlipped.value = false
        setTimeout(() => {
            currentIndex.value++
            updateCurrentCard()
        }, 150)
    }
}

const prevCard = () => {
    if (currentIndex.value > 0) {
        isFlipped.value = false
        setTimeout(() => {
            currentIndex.value--
            updateCurrentCard()
        }, 150)
    }
}

// 4. Thêm thẻ mới vào Deck
const addCard = async () => {
    try {
        cardSubmitting.value = true
        await axios.post(`http://localhost:8000/api/flashcards/decks/${activeDeck.value}/cards`, {
            front: newFront.value,
            back: newBack.value
        }, getAuthHeaders())
        newFront.value = ''
        newBack.value = ''
        selectDeck(activeDeck.value) // Refresh deck cards
        fetchDecks() // Refresh cards count
    } catch (err) {
        alert('Lỗi thêm thẻ nhớ!')
    } finally {
        cardSubmitting.value = false
    }
}

// 🤖 5. GỌI AI GEMINI TỰ ĐỘNG VIẾT ĐỊNH NGHĨA
const generateAi = async () => {
    if (!newFront.value) return
    try {
        aiLoading.value = true
        newBack.value = '🤖 Gemini đang phân tích và tìm định nghĩa chuẩn nhất cho anh...'
        const res = await axios.post('http://localhost:8000/api/flashcards/ai-generate', {
            keyword: newFront.value
        }, getAuthHeaders())
        newBack.value = res.data.definition
    } catch (err) {
        newBack.value = ''
        alert(err.response?.data?.message || 'Lỗi gọi AI Gemini, vui lòng kiểm tra lại API Key ở Backend!')
    } finally {
        aiLoading.value = false
    }
}

// 6. Xóa Deck & Card
const deleteDeck = async (id) => {
    if (!confirm('Anh có chắc muốn xóa bộ thẻ này không?')) return
    await axios.delete(`http://localhost:8000/api/flashcards/decks/${id}`, getAuthHeaders())
    fetchDecks()
}

const deleteCard = async (id) => {
    await axios.delete(`http://localhost:8000/api/flashcards/cards/${id}`, getAuthHeaders())
    selectDeck(activeDeck.value)
    fetchDecks()
}

onMounted(() => {
    fetchDecks()
})
</script>

<style scoped>
/* Hiệu ứng 3D Flip Card chuẩn CSS */
.perspective-1000 {
    perspective: 1000px;
}

.transform-style-3d {
    transform-style: preserve-3d;
}

.backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}
</style>