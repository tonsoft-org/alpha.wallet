<template>
  <base-layout>
    <template v-slot:content>
      <v-app-bar color="cyan darken-2" dark elevation="0">
        <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </router-link>
        <div class="text-center font-weight-bold flex-fill">{{ $t('Send') }}</div>
      </v-app-bar>

      <div class="text-center display-1 grey--text pa-5">{{ $t('Create transaction') }}</div>

      <v-container fluid class="pb-10">
        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-select
                color="cyan darken-2"
                v-model="from"
                :items="accounts"
                :item-text="item => item.id"
                :item-value="item => item.id"
                :label="$t('From')"
                @change="changeFrom"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-text-field
                v-model="to"
                color="cyan darken-2"
                :label="$t('To')"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-text-field
                v-model="amount"
                color="cyan darken-2"
                :label="$t('Amount')"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6" offset-md="3">
            <v-text-field
                v-model="memo"
                color="cyan darken-2"
                :label="$t('Memo')"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row v-if="!deployed">
          <v-col cols="11" md="6" offset-md="3">
            <v-alert prominent type="error">
              {{ $t('It looks like your wallet is not deployed. Please do this in order to complete any transactions.') }}
              <div class="text-right"><v-btn @click.stop="deploy_modal = true">{{ $t('Deploy') }}</v-btn></div>
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="!checkBalance">
          <v-col cols="12" md="6" offset-md="3">
            <v-alert type="warning">
              {{ $t('Insufficient balance') }}
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-if="checkBalance && deployed">
          <v-col cols="12" md="6" offset-md="3">
            <v-btn class="cyan darken-2" elevation="0" dark width="100%" @click.stop="send_modal = true">
              {{ $t('Send') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <deploy
          v-model="deploy_modal"
          :password="user.password"
          :nonce="user.nonce"
          :seed="account.seed"
          :account_nonce="account.nonce"
          :contract="account.contract"
          @deployed = "deployed = true"
      />

      <send
          v-model="send_modal"
          :password="user.password"
          :nonce="user.nonce"
          :seed="account.seed"
          :account_nonce="account.nonce"
          :contract="account.contract"
          :from="from"
          :to="to"
          :amount="amount"
          :memo="memo"
          @sent="sent"
      />
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import Account from "@/models/account";
import Deploy from "@/components/Modals/Deploy";
import Send from "@/components/Modals/Send";

export default {
  components: {Send, Deploy, BaseLayout},
  props: ['id'],
  mounted () {
    this.from = this.id;
    this.checkDeploy();
  },
  computed: {
    user: {
      get () { return this.$store.getters.getAuthUser },
    },
    account: function () {
      return Account.find(this.id);
    },
    accounts: function () {
      return Account.query().where('user_id', this.user.id).get();
    },
    checkBalance () {
      return (Number(this.account.balance/1000000000) >= Number(this.amount));
    }
  },
  data: () => {
    return {
      from: '',
      to: '',
      amount: "0",
      memo: "",
      deployed: false,
      deploy_modal: false,
      send_modal: false,
    }
  },
  methods: {
    changeFrom (emit) {
      this.$router.push({name: 'accounts.send', params: {id: emit}}).then(() => {
        this.checkDeploy();
      });
    },
    async checkDeploy () {
      if (!this.account.code_hash) {
        if (!(await this.$sdk.idDeployed(this.account.id))) {
          return this.deployed = false;
        }
      }
      return this.deployed = true;
    },
    sent (result) {
      this.$router.push({name: 'accounts.sent', params: {id: this.account.id, transaction_id: result.transaction.id}});
    }
  }
}
</script>