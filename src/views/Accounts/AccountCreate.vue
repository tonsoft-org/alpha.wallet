<template>
  <base-layout>
    <template v-slot:content>
      <v-app-bar class="cyan darken-2" dark>
        <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </router-link>
        <div class="text-center font-weight-bold flex-fill">{{ $t('Create account') }}</div>
      </v-app-bar>

      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step
              :complete="step > 1"
              step="1"
              color="cyan darken-2"
          >
            {{ $t('Password') }}
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
              :complete="step > 2"
              step="2"
              color="cyan darken-2"
          >
            {{ $t('Contract') }}
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
              step="3"
              :complete="step > 3"
              color="cyan darken-2"
          >
            {{ $t('Seed') }}
          </v-stepper-step>
        </v-stepper-header>

        <v-container>
          <v-row>
            <v-col cols="12" md="4" offset-md="4">
              <v-stepper-items>
                <v-stepper-content step="1">
                  <div class="text-center display-1 grey--text pa-5">{{ $t('Enter password') }}</div>
                  <v-text-field
                      v-model="password"
                      type="password"
                      color="cyan darken-2"
                  />

                  <v-btn color="cyan darken-2" dark @click="checkPassword" width="50%">{{ $t('Continue') }}</v-btn>
                  <v-btn text width="50%" :to="{name: 'main.index'}">{{ $t('Cancel') }}</v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <div class="text-center display-1 grey--text pa-5">{{ $t('Select contract') }}</div>
                  <v-select
                      v-model="contract"
                      :items="contracts"
                      :label="$t('Contract')"
                      color="cyan darken-2"
                  />
                  <v-select
                      v-model="word_count"
                      :items="[12, 24]"
                      :label="$t('Word count')"
                      color="cyan darken-2"
                  />

                  <v-btn color="cyan darken-2" dark @click="generateSeed(); step = 3" width="50%">{{ $t('Continue') }}</v-btn>
                  <v-btn text width="50%" :to="{name: 'main.index'}">{{ $t('Cancel') }}</v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <div class="text-center display-1 grey--text pa-5">{{ $t('Save seed') }}</div>
                  <div class="pa-3">{{ seed }}</div>
                  <v-btn color="cyan darken-2" dark @click="seed=''" :to="{name: 'accounts.show', params: {id: address}}" width="100%">
                    {{ $t('Go to account') }}
                  </v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-col>
          </v-row>
        </v-container>
      </v-stepper>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import Account from "@/models/account";

export default {
  components: {BaseLayout},
  computed: {
    user: {
      get () { return this.$store.getters.getAuthUser },
    },
  },
  data: () => {
    return {
      password: '',
      step: 1,
      contract: 'SafeMultisig',
      contracts: ['SafeMultisig', 'SetCodeMultisig'],
      word_count: 12,
      seed: '',
      address: '',
    }
  },
  methods: {
    checkPassword () {
      this.$sdk.chacha20Decrypt(this.user.password, this.password, this.user.nonce).then((response) => {
        if (response === this.password) {
          this.step = 2;
        } else {
          this.password = '';
        }
      });
    },
    async generateAddress () {
      const keys = await this.$sdk.seedToKeys(this.seed);
      this.address = await this.$sdk.generateAddress(keys, this.contract);
      const seed = await this.$sdk.chacha20Encrypt(this.seed, this.password);
      this.password = '';

      await Account.insert({
        data: {
          id: this.address,
          user_id: this.user.id,
          seed: seed.data,
          nonce: seed.nonce,
          contract: {
            name: this.contract,
            dictionary: 1,
            word_count: this.word_count
          },
        }
      });
    },
    async generateSeed () {
      this.seed = await this.$sdk.generateSeed(1, this.word_count);
      await this.generateAddress();
    },
  }
}
</script>
