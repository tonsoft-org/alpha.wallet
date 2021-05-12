<template>
  <base-layout>
    <template v-slot:content>
      <div>
        <v-tabs v-model="tab" centered dark icons-and-text background-color="cyan darken-2">
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#tab-1">
            {{ $t('Accounts') }}
            <v-icon>mdi-wallet</v-icon>
          </v-tab>
          <v-tab href="#tab-2">
            {{ $t('Settings') }}
            <v-icon>mdi-tune</v-icon>
          </v-tab>
          <v-tab href="#tab-3">
            {{ $t('DeBrowser') }}
            <v-icon>mdi-earth</v-icon>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item value="tab-1">
            <v-card flat v-if="accounts.length">
              <v-card-text>
                <div>
                  <v-list>
                    <v-list-item
                        v-for="account in accounts"
                        :key="account.id"
                        :to="{name: 'accounts.show', params: {id: account.id}}"
                        class="mt-5"
                    >
                      <v-list-item-avatar>
                        <v-icon class="cyan darken-2" dark>
                          mdi-diamond-stone
                        </v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title v-text="account.id"></v-list-item-title>

                      <!--<v-list-item-subtitle v-text="'wallet'"></v-list-item-subtitle>-->
                      </v-list-item-content>

                      <v-list-item-action class="grey--text font-weight-bold mr-2">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                              {{ (parseInt(account.balance)/1000000000).toFixed(4) }}
                            </span>
                            </template>
                            <span>{{ $t('Balance') }}</span>
                        </v-tooltip>
                      </v-list-item-action>
                      <v-list-item-action>
                        <v-btn icon @click.prevent="">
                          <v-icon color="grey lighten-1">mdi-information</v-icon>
                        </v-btn>
                      </v-list-item-action>
                      <v-list-item-action class="ml-0">
                        <v-btn icon @click.prevent="deleteAccount(account.id)">
                          <v-icon color="grey lighten-1">mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
            <div v-else>
              <div class="text-center display-1 grey--text pa-5 mt-4 mb-4">{{ $t('You don\'t have an account yet.') }}</div>
            </div>

            <div class="text-center pb-8 font-weight-bold">
              <v-container fluid>
                <v-row>
                  <v-col cols="6" md="3" offset-md="3" class="pr-5">
                    <v-btn :to="{name: 'accounts.create'}" color="cyan darken-2" width="100%" dark elevation="0">
                      {{ $t('Create account') }}
                    </v-btn>
                  </v-col>

                  <v-col cols="6" md="3" class="pl-5">
                    <v-btn :to="{name: 'accounts.import'}" color="cyan darken-2" width="100%" dark elevation="0">
                      {{ $t('Import account') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </v-tab-item>
          <v-tab-item value="tab-2">
            <v-container fluid class="mt-4">
              <v-row>
                <v-col cols="12" md="4" offset-md="4">
                  <v-select
                      v-model="lang"
                      :items="['en', 'ru']"
                      :label="$t('Language')"
                      @change="changeLanguage"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4" offset-md="4">
                  <v-select
                      v-model="network"
                      :items="['net.ton.dev', 'main.ton.dev']"
                      :label="$t('Network')"
                      @change="changeNetwork"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4" offset-md="4" class="text-center">
                  <a @click="logout" class="cyan--text text--darken-2 text-decoration-none text-uppercase">
                    {{ $t('Logout') }}
                  </a>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item value="tab-3">
            <div class="text-center display-1 grey--text pa-5">{{ $t('Soon') }}</div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import Account from "@/models/account";
import VuexLocalStorage from "@/classes/VuexLocalStorage";
import App from "@/classes/App";

export default {
  components: {BaseLayout},
  computed: {
    userId: {
      get () { return this.$store.getters.getAuthUserId; },
    },
    user: {
      get () { return this.$store.getters.getAuthUser; },
    },
    accounts: function () {
      return Account.query().where('user_id', this.userId).get();
    }
  },
  data: function () {
    return {
      tab: 'tab-1',
      network: VuexLocalStorage.getSettings('network', 'net.ton.dev'),
      lang: localStorage.getItem('lang') || 'en',
    };
  },
  methods: {
    deleteAccount (id) {
      const result = confirm(this.$t('Delete account') + " ?");
      if (result) {
        Account.delete(id);
      }
    },
    changeLanguage (lang) {
      localStorage.setItem('lang', lang);
      location.reload();
    },
    changeNetwork (network) {
      App.setNetwork(network);
      location.reload();
    },
    logout () {
      App.setUser(null);
      location.reload();
    }
  }
}
</script>
