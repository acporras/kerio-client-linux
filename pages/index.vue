<template lang="pug">
div
  v-app-bar(app)
    v-toolbar-title
      v-img(src='./logo.png', width='80px')
    v-toolbar-title
      h3 Kerio Client Linux
  v-main
    section
      v-container
        v-row(justify='center')
          v-col(md="4" align='center')
            span Estado: #[v-chip(dark, :color='info.color') {{ info.text }}]
        v-row(justify='center')
          v-col(md="4" align='center')
            v-combobox(v-model="connection" label="Servidor:" :items="config.connections" readonly item-text="connection[0].server[0]" item-value="connection[0].server[0]")
        v-row(justify='center')
          v-col(md="4" align='center')
            v-combobox(v-model="connection" label="Usuario:" :items="config.connections" readonly item-text="connection[0].username[0]" item-value="connection[0].username[0]")
        v-row(justify='center')
          v-col(md="4" align='center')
            span {{ info.message }}
        v-divider
        v-row(justify='center')
          v-col(md="4" align='center')
            v-btn.mr-4(depressed :disabled="info.valid" @click="connect") Conectar
            v-btn(depressed :disabled="!info.valid" @click="disconnect") Desconectar
</template>
<script>
export default {
  components: {},
  data() {
    return {
      info: {
        text: 'Inactivo',
        color: 'red',
        message: '',
        valid: false,
      },
      config: {
        connections: [],
      },
      defaultConfig: {
        connections: [],
      },
      connection: [
        {
          username: [],
        },
      ],
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.status()
      this.connections()
    },
    connections() {
      this.$axios
        .$request({
          url: '/api/connections',
          method: 'POST',
          responseType: 'json',
        })
        .then((resp) => {
          this.config = resp.transaction.config
          if (this.config.connections.length > 0) {
            this.connection = this.config.connections[0]
          }
        })
        .catch((err) => {
          this.info.text = 'Error'
          this.info.color = 'red'
          this.info.message = err
          this.info.valid = false
        })
    },
    status() {
      this.$axios
        .$request({
          url: '/api/status',
          method: 'POST',
          responseType: 'json',
        })
        .then((resp) => {
          this.info.text = resp.valid ? 'Activo' : 'Inactivo'
          this.info.color = resp.valid ? 'green' : 'red'
          this.info.message = ''
          this.info.valid = resp.valid
        })
        .catch((err) => {
          this.info.text = 'Error'
          this.info.color = 'red'
          this.info.message = err
          this.info.valid = false
        })
    },
    connect() {
      this.$axios
        .$request({
          url: '/api/connect',
          method: 'POST',
          responseType: 'json',
        })
        .then((resp) => {
          this.status()
        })
        .catch((err) => {
          this.info.text = 'Error'
          this.info.color = 'red'
          this.info.message = err
          this.info.valid = false
        })
    },
    disconnect() {
      this.$axios
        .$request({
          url: '/api/disconnect',
          method: 'POST',
          responseType: 'json',
        })
        .then((resp) => {
          this.status()
        })
        .catch((err) => {
          this.info.text = 'Error'
          this.info.color = 'red'
          this.info.message = err
          this.info.valid = false
        })
    },
  },
  middleware: 'middleware',
}
</script>
