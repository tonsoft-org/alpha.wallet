<template>
  <base-layout>
    <template v-slot:content>
      <v-app-bar class="cyan darken-2" dark>
        <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </router-link>
        <div class="text-center font-weight-bold flex-fill">{{ $t('Seed') }}</div>
      </v-app-bar>

      <v-stepper v-model="step">
        <v-stepper-header>
          <v-divider></v-divider>

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
            {{ $t('Seed') }}
          </v-stepper-step>

          <v-divider></v-divider>
        </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container fluid>
                  <v-row>
                    <v-col cols="12" md="4" offset-md="4">
                      <div class="text-center display-1 grey--text pa-5">{{ $t('Enter password') }}</div>
                      <v-text-field
                          v-model="password"
                          type="password"
                          color="cyan darken-2"
                      />

                      <v-btn color="cyan darken-2" dark @click="checkPassword(); getSeed();" width="50%">{{ $t('Continue') }}</v-btn>
                      <v-btn text width="50%" :to="{name: 'main.index'}">{{ $t('Cancel') }}</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-container fluid>
                  <v-row>
                    <v-col cols="12">
                      <div>
                        <v-subheader>{{ $t('Seed') }}:</v-subheader>
                        <div class="pa-3 text-h6 grey--text font-weight-bold">{{ seed }}</div>
                      </div>

                      <div>
                        <v-subheader>{{ $t('Public key') }}:</v-subheader>
                        <div class="pa-3 text-h6 grey--text font-weight-bold wrap">{{ keys.public }}</div>
                      </div>

                      <div>
                        <v-subheader>{{ $t('Secret key') }}:</v-subheader>
                        <div class="pa-3 text-h6 grey--text font-weight-bold wrap">{{ keys.secret }}</div>
                      </div>

                      <v-btn class="mt-4" color="cyan darken-2" elevation="0" dark :to="{name: 'accounts.show', params: {id: account.id}}" width="100%">
                        {{ $t('Go to account') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-stepper-content>
            </v-stepper-items>
      </v-stepper>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import Account from "@/models/account";

export default {
  components: {BaseLayout},
  props: ['id'],
  computed: {
    user: {
      get () { return this.$store.getters.getAuthUser },
    },
    account: function () {
      return Account.find(this.id);
    }
  },
  data: () => {
    return {
      password: '',
      step: 1,
      seed: '',
      keys: {public: '', secret: ''}
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
    async getSeed () {
      this.seed = await this.$sdk.chacha20Decrypt(this.account.seed, this.password, this.account.nonce);
      this.keys = await this.$sdk.seedToKeys(this.seed);
    },
  }
}
</script>
