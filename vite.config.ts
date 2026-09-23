import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'

function logoUploadPlugin(): Plugin {
  return {
    name: 'logo-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-logo', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { image } = JSON.parse(body)
              if (!image) throw new Error('No image provided')
              const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
              const buffer = Buffer.from(base64Data, 'base64')

              const publicDir = path.resolve(import.meta.dirname, 'public')
              if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

              fs.writeFileSync(path.join(publicDir, 'circus-logo.png'), buffer)
              fs.writeFileSync(path.join(publicDir, 'circus-logo.jpg'), buffer)
              fs.writeFileSync(path.join(publicDir, 'circus-hero.png'), buffer)
              fs.writeFileSync(path.join(publicDir, 'circus-hero.jpg'), buffer)

              const assetsDir = path.resolve(import.meta.dirname, 'src/assets/images')
              if (fs.existsSync(assetsDir)) {
                try {
                  fs.writeFileSync(path.join(assetsDir, 'official_circus_logo.jpg'), buffer)
                } catch (e) {
                  console.warn('Could not write to assets dir:', e)
                }
              }

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true, url: '/circus-logo.png?t=' + Date.now() }))
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown error'
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: message }))
            }
          })
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), logoUploadPlugin()],
  resolve: {
    alias: {
      '@/lib': path.resolve(import.meta.dirname, 'src/lib'),
      '@/components': path.resolve(import.meta.dirname, 'src/components'),
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
})

