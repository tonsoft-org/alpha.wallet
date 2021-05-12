<template>
  <base-layout>
    <template v-slot:content>
      <v-app-bar color="cyan darken-2" dark elevation="0">
        <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </router-link>
        <div class="text-center font-weight-bold flex-fill">{{ $t('Sent') }}</div>
      </v-app-bar>

      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <div class="text-center display-1 grey--text pa-5">{{ $t('Transaction was successfully sent') }}</div>
            <div class="text-center">
              <v-icon x-large color="cyan darken-2">
                mdi-check-circle
              </v-icon>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" offset-md="3" class="text-center">
            <div v-clipboard:copy="transaction_id" class="font-weight-bold">
              <span class="hidden-lg-and-up">{{ transaction_id.substring(0, 16) }} ... {{ transaction_id.substring(50) }}</span>
              <span class="hidden-md-and-down text-caption font-weight-bold">{{ transaction_id }}</span>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon small class="ml-2" v-bind="attrs" v-on="on">
                    mdi-content-copy
                  </v-icon>
                </template>
                <span>{{ $t('Copy') }}</span>
              </v-tooltip>
            </div>
            <v-btn class="mt-4" color="cyan darken-2" elevation="0" dark :to="{name: 'accounts.show', params: {id: account.id}}" width="100%">
              {{ $t('Go to account') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>


    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import Account from "@/models/account";

export default {
  components: {BaseLayout},
  props: ['id', 'transaction_id'],
  computed: {
    user: {
      get () { return this.$store.getters.getAuthUser },
    },
    account: function () {
      return Account.find(this.id);
    },
  },
  data: () => {
    return {}
  },
  methods: {}
}
</script>