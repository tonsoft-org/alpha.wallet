<template>
  <base-layout>
    <template v-slot:content>
      <v-app-bar class="cyan darken-2" dark>
        <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </router-link>
        <div class="text-center font-weight-bold flex-fill">{{ $t('Import account') }}</div>
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
              step="2"
              :complete="step > 2"
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
                  <v-alert v-if="errors.length" type="error">
                    {{ errors[0] }}
                  </v-alert>

                  <v-textarea v-model="seed" :label="$t('Enter your seed')" color="cyan darken-2"/>
                  <v-select
                      v-model="contract"
                      :items="['SafeMultisig', 'SetCodeMultisig']"
                      :label="$t('Contract')"
                      color="cyan darken-2"
                  />
                  <v-btn color="cyan darken-2" dark @click="importBySeed" width="100%">
                    {{ $t('Import') }}
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
      seed: '',
      errors: [],
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
    async importBySeed () {
      this.errors = [];
      const keys = await this.$sdk.seedToKeys(this.seed).catch((error) => {this.errors.push(error);});
      const address = await this.$sdk.generateAddress(keys, this.contract).catch((error) => {this.errors.push(error);});
      const seed = await this.$sdk.chacha20Encrypt(this.seed, this.password).catch((error) => {this.errors.push(error);});

      if (!this.errors.length) {
        if (keys !== "undefined") {
          await Account.insert({
            data: {
              id: address,
              user_id: this.user.id,
              seed: seed.data,
              nonce: seed.nonce,
              contract: {
                name: this.contract,
              },
            }
          });
        }

        await this.$router.push({name: 'accounts.show', params: {id: address}});
        location.reload();
      }
    },
  }
}
</script>
