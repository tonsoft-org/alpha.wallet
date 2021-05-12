<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'VApp',
  mounted () {
    window.addEventListener('storage_updated',
        (e) => {
      this.$store.replaceState(e.detail);
      }, false);
  },
  computed: {
  },
  methods: {
  }
}
</script>