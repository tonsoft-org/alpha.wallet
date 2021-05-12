<template>
  <base-layout>
    <template v-slot:content>
      <v-app-bar class="cyan darken-2" dark elevation="0">
        <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </router-link>
        <div class="text-center font-weight-bold flex-fill text-caption pointer" v-clipboard:copy="account.id">
          <div class="d-none d-md-block">
            {{ account.id }}
          </div>
          <div class="d-md-none">
            {{ account.id.substring(0, 16) }}
            ...
            {{ account.id.substring(50) }}
          </div>
        </div>
      </v-app-bar>

      <v-container fluid>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn elevation="0" @click="forceUpdate(account.id)">
              {{ $t('Update') }}
            </v-btn>
            <v-btn elevation="0" :to="{name: 'accounts.show.seed', params: {id: account.id}}" class="ml-2">
              {{ $t('Seed & Keys') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-center">
            <div class="display-2 grey--text">
              {{ (Number(account.balance)/1000000000).toFixed(6) }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" offset-md="4">
            <v-row>
              <v-col cols="12">
                <v-btn class="cyan darken-2" width="100%" elevation="0" :to="{name: 'accounts.send', params: {id: account.id}}" dark>
                  {{ $t('Send') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-tabs color="cyan darken-2" v-model="tab" class="mt-5" grow>
        <v-tab>{{ $t('Messages') }}</v-tab>
        <v-tab>{{ $t('Transactions') }}</v-tab>
        <v-tab>{{ $t('Info') }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-list dense>
            <v-list-item-group>
              <v-list-item v-for="(message, i) in messages" :key="i">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="8" md="6">
                          <div v-clipboard:copy="message.id" class="font-weight-bold">
                            <span class="hidden-lg-and-up">{{ message.id.substring(0, 16) }} ... {{ message.id.substring(50) }}</span>
                            <span class="hidden-md-and-down">{{ message.id }}</span>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2" v-bind="attrs" v-on="on">
                                  mdi-content-copy
                                </v-icon>
                              </template>
                              <span>{{ $t('Copy') }}</span>
                            </v-tooltip>
                          </div>
                          <div class="caption grey--text mt-1">
                            {{ (new Date(Number(message.created_at)*1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })) }}
                          </div>
                        </v-col>

                        <v-col cols="2" md="3" class="grey--text hidden-md-and-down">
                          {{ message.decoded_body }}
                        </v-col>

                        <v-col cols="4" md="3" class="text-right">
                          <div class="text-h6 font-weight-bold">
                            <v-icon small :color="(message.src === account.id) ? 'red' : 'cyan darken-2'">
                              {{ (message.src === account.id) ? 'mdi-minus' : 'mdi-plus' }}
                            </v-icon>
                            {{ message.value / 1000000000 }}
                            <v-icon small color="cyan darken-2">mdi-diamond</v-icon>
                          </div>
                          <div>
                            {{
                              (message.src === account.id) ?
                                  (message.dst.substring(0, 6)+'...'+message.dst.substring(62)) :
                                  (message.src.substring(0, 6)+'...'+message.src.substring(62))
                            }}
                          </div>
                        </v-col>

                        <v-col cols="12" class="grey--text hidden-lg-and-up">
                          {{ message.decoded_body }}
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
        <v-tab-item>
          <v-list dense>
            <v-list-item-group>
              <v-list-item v-for="(transaction, i) in transactions" :key="i">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="6" md="6">
                          <div v-clipboard:copy="transaction.id" class="font-weight-bold">
                            <span class="hidden-lg-and-up">{{ transaction.id.substring(0, 16) }} ... {{ transaction.id.substring(50) }}</span>
                            <span class="hidden-md-and-down">{{ transaction.id }}</span>
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon small class="ml-2" v-bind="attrs" v-on="on">
                                  mdi-content-copy
                                </v-icon>
                              </template>
                              <span>{{ $t('Copy') }}</span>
                            </v-tooltip>
                          </div>
                          <div class="caption grey--text mt-1">
                            {{ (new Date(Number(transaction.time)*1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })) }}
                          </div>
                        </v-col>

                        <v-col cols="6" md="6" class="text-right">
                          <div class="text-h6 font-weight-bold">
                            {{ (parseInt(transaction.balance_delta, 16)/1000000000).toFixed(4) }}
                            <v-icon small color="cyan darken-2">mdi-diamond</v-icon>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-tab-item>
        <v-tab-item>
          <div class="pa-6 pa-md-10">
            <div class="grey--text font-weight-bold text-caption mt-2">
              {{ $t('ID') }}: {{ account.id }}
            </div>
            <div class="grey--text font-weight-bold text-caption mt-2">
              {{ $t('Balance') }}: {{ parseInt(account.balance, 16)/1000000000 }}
            </div>
            <div class="grey--text font-weight-bold text-caption mt-2">
              {{ $t('Contract') }}: {{ account.contract.name }}
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import Account from "@/models/account";
import Transaction from "@/models/transaction";
import Messages from "@/models/message";
import App from "@/classes/App";

export default {
  components: {BaseLayout},
  props: {
    id: String,
  },
  mounted() {
    App.updateAccountData(this.id);
  },
  computed: {
    account: function () {
      return Account.query().where('id', this.id).first();
    },
    transactions: function () {
      return Transaction.query().where('account_id', this.id).orderBy('time', 'desc').get();
    },
    messages: function () {
      return Messages.query().where('dst', this.id).orWhere('src', this.id).orderBy('created_at', 'desc').get();
    },
  },
  data: function () {
    return {
      tab: 0,
    };
  },
  methods: {
    async forceUpdate () {
      App.updateAccountData(this.account.id);
    },
    goToMessage () {
      //todo
    },
  }
}
</script>