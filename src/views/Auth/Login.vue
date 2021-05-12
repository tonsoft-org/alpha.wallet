<template>
  <base-layout>
    <template v-slot:content>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <div class="text-center display-1 grey--text pa-5">{{ $t('Login') }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" offset-md="3" class="text-center">
            <v-select
                v-model="user"
                :items="users"
                :item-text="item => item.name"
                :item-value="item => item"
                :label="$t('User')"
                color="cyan darken-2"
            />
          </v-col>
          <v-col cols="12" md="6" offset-md="3">
            <v-text-field
                v-model="password"
                :label="$t('Password')"
                type="password"
                color="cyan darken-2"
            />
          </v-col>
          <v-col cols="12" md="6" offset-md="3" class="text--black pb-10">
              <v-row>
                <v-col cols="6" class="pr-5">
                  <v-btn @click="login" color="cyan darken-2" width="100%" dark elevation="0">
                    {{ $t('Login') }}
                  </v-btn>
                </v-col>

                <v-col cols="6" class="pl-5">
                  <v-btn :to="{name: 'registration'}" color="cyan darken-2" width="100%" dark elevation="0">
                    {{ $t('Registration') }}
                  </v-btn>
                </v-col>
              </v-row>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-layout>
</template>

<script>
import BaseLayout from "@/views/layouts/BaseLayout";
import User from "@/models/user";
import App from "@/classes/App";

export default {
  name: "Login",
  components: {BaseLayout},
  computed: {
    users : function () {
      return User.all();
    }
  },
  data: () => {
    return {
      user: {
        id: null,
      },
      password: '',
    }
  },
  methods: {
    login: function () {
      this.$sdk.chacha20Decrypt(this.user.password, this.password, this.user.nonce).then((response) => {
        if (response === this.password) {
          App.setUser(this.user);
          setTimeout(() => {this.$router.push({name: 'main.index'}); location.reload(); }, 1000)
        }
        this.password = '';
      });
    }
  }
};
</script>