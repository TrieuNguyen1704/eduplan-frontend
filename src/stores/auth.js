import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('access_token') || null,
    loading: false,
    error: null
  }),
  
  actions: {
    // 1. Hành động Đăng nhập
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/login`, { email, password })
        this.token = response.data.access_token
        this.user = response.data.user
        
        localStorage.setItem('access_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Đăng nhập thất bại'
        return false
      } finally {
        this.loading = false
      }
    },

    // 2. Hành động Đăng ký
    async register(name, email, password, password_confirmation) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${API_URL}/register`, {
          name, email, password, password_confirmation
        })
        this.token = response.data.access_token
        this.user = response.data.user
        
        localStorage.setItem('access_token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (err) {
        this.error = err.response?.data?.errors || { message: 'Đăng ký thất bại' }
        return false
      } finally {
        this.loading = false
      }
    },

    // 3. Hành động Đăng xuất
    async logout() {
      try {
        await axios.post(`${API_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
      } catch (err) {
        console.error('Lỗi khi đăng xuất backend:', err)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      }
    }
  }
})