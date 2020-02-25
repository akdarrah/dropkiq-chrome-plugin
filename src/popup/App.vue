<template>
  <div class="dropkiq-popup">
    <div class="container-fluid">
      <div class="row p-2">
        <div class="col-12 p-0">
          <div class="form-group">
            <input v-model="expression" placeholder="Liquid Expression" class="form-control"></input>
          </div>
          <button class="btn btn-secondary" :data-clipboard-text="expression">
            Copy
          </button>
        </div>
      </div>
    </div>
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
.dropkiq-popup {
  width: 600px;
}
</style>
