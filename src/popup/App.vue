<template>
  <div>
    <input v-model="expression" placeholder="edit me"></input>
    <button class="btn" :data-clipboard-text="expression">
      Copy
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      expression: ""
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 10px;
}
</style>
