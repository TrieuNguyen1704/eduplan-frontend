<template>
    <div
        class="h-screen bg-slate-900 flex text-slate-100 font-sans antialiased overflow-hidden selection:bg-amber-500 selection:text-slate-900">

        <aside class="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
            <div class="p-6 space-y-6">
                <div class="flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
                        👑
                    </div>
                    <div>
                        <span class="text-lg font-black tracking-wider text-white block leading-none">EDU<span
                                class="text-amber-400">ADMIN</span></span>
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-1">CDIO
                            System Console</span>
                    </div>
                </div>

                <nav class="space-y-1.5 pt-4 border-t border-slate-800/60">
                    <div class="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-3 mb-2">Quản trị
                        hệ thống</div>

                    <router-link to="/admin"
                        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs">
                        <span class="text-base">📊</span>
                        <span>Tổng quan (Dashboard)</span>
                    </router-link>

                    <router-link to="/dashboard"
                        class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition mt-4">
                        <span class="text-base">🎓</span>
                        <span>Giao diện Sinh viên</span>
                    </router-link>
                </nav>
            </div>

            <div
                class="p-4 m-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                <div class="flex items-center gap-3 overflow-hidden">
                    <div
                        class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-md">
                        TN</div>
                    <div class="truncate">
                        <div class="text-xs font-black text-white truncate">Triều Nguyên</div>
                        <div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Tech Lead</div>
                    </div>
                </div>
                <button @click="handleLogout"
                    class="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition cursor-pointer">🚪</button>
            </div>
        </aside>

        <main class="h-screen flex-1 flex flex-col min-w-0 bg-slate-900/50 overflow-hidden">
            <header
                class="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-slate-950/40 backdrop-blur-md shrink-0">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span>Hệ thống CDIO</span>
                    <span>/</span>
                    <span class="text-amber-400 font-extrabold">Trang Quản Trị</span>
                </div>
                <div class="flex items-center gap-3">
                    <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Server: Online (Laravel 12)
                    </span>
                </div>
            </header>

            <div class="p-8 flex-1 overflow-y-auto custom-scrollbar">
                <slot></slot>
            </div>
        </main>

    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const handleLogout = async () => {
    if (!confirm('👑 Anh Nguyên có chắc chắn muốn đăng xuất khỏi Trung Tâm Quản Trị không?')) return
    try {
        const token = localStorage.getItem('access_token')
        if (token) {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
        }
    } catch (err) { console.error(err) } finally {
        localStorage.removeItem('access_token'); localStorage.removeItem('user'); router.push('/login')
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #334155;
}
</style>