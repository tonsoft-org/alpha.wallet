<template>
  <base-layout>
    <template v-slot:content>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <div class="text-center display-1 grey--text pa-5">{{ $t('Registration') }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" offset-md="3" class="text-center">
            <v-text-field
                v-model="name"
                :label="$t('Name')"
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
              <v-col cols="6">
                <v-btn @click="submit" color="cyan darken-2" width="100%" dark elevation="0">
                  {{ $t('Registration') }}
                </v-btn>
              </v-col>

              <v-col cols="6" class="text-center">
                <router-link :to="{name: 'login'}" class="cyan--text text--darken-2 text-decoration-none text-uppercase">
                  {{ $t('I have account') }}
                </router-link>
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
  data: () => ({
    name: '',
    password: '',
  }),
  methods: {
    async submit () {
      const result = await this.$sdk.chacha20Encrypt(this.password, this.password);
      this.password = '';
      const user = (await User.insert({data: {name: this.name, password: result.data, nonce: result.nonce}})).users[0];
      App.setUser(user);
      await this.$router.push({name: 'main.index'});
      location.reload();
    },
  }
};
</script>