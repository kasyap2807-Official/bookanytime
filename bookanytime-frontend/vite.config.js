import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
    host: "0.0.0.0", // Allow access from external devices
    port: 5173, // Change if needed
    strictPort: true, // Ensures the exact port is used
    allowedHosts: ["www.bookanytime.in"], // ✅ Add your domain here
  },
})
