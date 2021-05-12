<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    chrome.runtime.onMessage.addListener(
        (request) => {
          if (request.msg === "storage_updated") {
            this.$store.replaceState(request.data);
          }
        }
    );
  },
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
