<template>
  <v-dialog
      v-model="show"
      max-width="500px"
      @click:outside="$emit('input', false)"
      @keydown.esc.prevent="$emit('input', false)"
  >
    <v-card>
      <div v-if="error" class="text-center">
        {{ error }}
      </div>

      <v-container v-else>
        <v-row>
          <v-col cols="12">
            <v-text-field
                autofocus
                v-model="input"
                type="password"
                :label="$t('Password')"
                color="cyan darken-2"
            />
          </v-col>
        </v-row>

        <v-row v-if="processing" class="text-center">
          <v-col cols="12">
            <v-progress-circular
                indeterminate
                color="cyan darken-2"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <v-btn color="cyan darken-2" elevation="0" dark width="100%" @click.stop="show=false">
              {{ $t('Confirm') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    password: String,
    nonce: String,
    seed: String,
    account_nonce: String,
    contract: Object,
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      async set () {
        const response = await this.$sdk.chacha20Decrypt(this.password, this.input, this.nonce);
        if (response === this.input) {
          const seed = await this.$sdk.chacha20Decrypt(this.seed, this.input, this.account_nonce);
          const keys = await this.$sdk.seedToKeys(seed);
          this.processing = true;
          const result = await this.$sdk.deploy(keys, this.contract.name).catch((error) => { this.error = error});
          if (typeof result.transaction !== "undefined") {
            this.input = '';
            this.$emit('deployed', true);
            this.$emit('input', false);
          }
          this.processing = false;
        }
      }
    }
  },
  data: function () {
    return {
      input: '',
      processing: false,
      error: false,
    };
  }
}
</script>