import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
    host: "0.0.0.0", // Allow access from external devices
    port: 5173, // Change if needed
    strictPort: true, // Ensures the exact port is used
    allowedHosts: ["ec2-50-16-122-218.compute-1.amazonaws.com"], // ✅ Add your domain here
  },
})
