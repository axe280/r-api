const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const app = express()

let CARDS = [
  {id: v4(), name: 'Amazing card', value: '298340293840', activated: false}
]

app.use(express.json())

app.get('/api/cards', (req, res) => {
  res.status(200).json(CARDS)
})

app.post('/api/cards', (req, res) => {
  const card = {...req.body, id: v4(), activated: false}
  CARDS.unshift(card)
  res.status(201).json(card)
})

app.delete('/api/cards/:id', (req, res) => {
  CARDS = CARDS.filter(card => card.id !== req.params.id)
  res.status(200).json({
    status: 'deleted',
    message: 'Card has been deleted'
  })
})

app.put('/api/cards/:id', (req, res) => {
  const idx = CARDS.findIndex(card => card.id === req.params.id)
  CARDS[idx] = req.body
  res.json(CARDS[idx])
})

app.use(express.static(path.resolve(__dirname, 'front')))

app.get('*', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'front', 'index.html'))
})

app.listen(3000, () => console.log("It's working... port: 3000"))