import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'a152a499-8eb9-4486-b34b-dc9e257ff46b-00-1h9phmlarc5g2.spock.replit.dev'
    ]
  }
})
