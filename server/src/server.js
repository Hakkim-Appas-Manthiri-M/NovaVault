const express = require('express')

const app = express()

const PORT = process.env.PORT || 5000

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'NovaVault API is running',
  })
})

app.listen(PORT, () => {
  console.log(`NovaVault server running on port ${PORT}`)
})