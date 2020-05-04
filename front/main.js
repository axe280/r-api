import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
import request from './api.js'

Vue.component('loader', {
  template: `
    <div class="spinner-wrapper">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `
})

Vue.component('alert', {
  props: ['alertInfo'],
  template: `
    <div class="alert-fixed">
      <div :class="checkStatus"
        class="alert" role="alert">
        {{ alertInfo.message }}
      </div>
    </div>
  `,

  computed: {
    checkStatus() {
      switch (this.alertInfo.status) {
        case 'success':
          return 'alert-success'
          break
        case 'deleted':
          return 'alert-danger'
          break
      }
    }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    loading: false,
    alertMessage: null,
    alertTimer: null,
    form: {
      name: '',
      value: ''
    },
    cards: []
  },

  computed: {
    isFormFileds() {
      return this.form.name && this.form.value
    }
  },

  methods: {
    async addCard() {
      try {
        const {...cardInfo} = this.form

        const newCard = await request('/api/cards', 'POST', cardInfo)
        this.cards.unshift(newCard)
        
        this.form.name = this.form.value = ''
        this.showAlert('success', 'Card has been created')
      } catch(e) {

      }
    },

    async activateButton(id) {
      try {
        const cardById = this.cards.find(card => card.id === id)

        const updateCard = await request(`/api/cards/${id}`, 'PUT', {
          ...cardById,
          activated: true
        })
        cardById.activated = updateCard.activated

        this.showAlert('success', 'Card has been activated')
      } catch(e) {

      }
    },

    async deleteCard(id) {
      try {
        const response = await request(`/api/cards/${id}`, 'DELETE')
        this.cards = this.cards.filter(card => card.id !== id)

        this.showAlert(response.status, response.message)
      } catch(e) {
        
      }
    },

    showAlert(status, message) {
      this.alertMessage = {
        status,
        message
      }

      clearTimeout(this.alertTimer)

      this.alertTimer = setTimeout(() => {
        this.alertMessage = null
      }, 2000);
    }
  },

  async mounted() {
    this.loading = true
    this.cards = await request('/api/cards')
    this.loading = false
  }
})
