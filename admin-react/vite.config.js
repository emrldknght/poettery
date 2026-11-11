import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3001,
        proxy: {
            '/admin-list': 'http://localhost:3002',
            '/admin-load': 'http://localhost:3002',
            '/admin-save': 'http://localhost:3002',
        },
    },
})