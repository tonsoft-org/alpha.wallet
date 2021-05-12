<template>
  <v-app id="inspire">
    <v-navigation-drawer v-if="user" v-model="drawer" absolute temporary>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            {{ user.name }}
          </v-col>
          <v-col cols="6">
            <a @click="logout" class="cyan--text text--darken-2 text-decoration-none text-uppercase">
              {{ $t('Logout') }}
            </a>
          </v-col>
        </v-row>
      </v-container>
      <v-list nav dense class="mt-6">
        <v-list-item-group active-class="cyan--text">
          <v-list-item>
            <v-list-item-title>
              <v-select
                  v-model="lang"
                  :items="['en', 'ru']"
                  :label="$t('Language')"
                  @change="changeLanguage"
              />
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              <v-select
                  v-model="network"
                  :items="['net.ton.dev', 'main.ton.dev']"
                  :label="$t('Network')"
                  @change="changeNetwork"
              />
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="user" app color="blue-grey lighten-5" flat elevation="0" id="app-bar">
      <v-container>
        <v-row >
          <v-col cols="6">
            <v-icon color="cyan darken-2" large>
              mdi-diamond-stone
            </v-icon>
            <span class="pl-3 font-weight-bold">
              <router-link :to="{name: 'main.index'}" class="cyan--text text--darken-2 text-decoration-none">Free TON</router-link>
            </span>
          </v-col>
          <v-col cols="6" class="text-right">
            <div @click.stop="drawer = !drawer" class="pointer">
              <span class="font-weight-bold grey--text text--darken-2 pa-2">{{ user.name }}</span>
              <v-icon>mdi-cog</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main class="mt-3">
      <v-container>
        <v-row>
          <v-sheet elevation="1" id="main-sheet">
            <slot name="content-section">
              <v-col cols="12" class="pa-0">
                <slot name="content">
                  <!-- -->
                </slot>
              </v-col>
            </slot>
          </v-sheet>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import App from "@/classes/App";
import VuexLocalStorage from "@/classes/VuexLocalStorage";

export default {
  name: "BaseLayout",
  computed: {
    user: {
      get () { return this.$store.getters.getAuthUser; },
    },
  },
  data: () => ({
    network: VuexLocalStorage.getSettings('network', 'net.ton.dev'),
    drawer: false,
    lang: localStorage.getItem('lang') || 'en',
  }),
  methods: {
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
};
</script>

<style>
html, body {
  max-width: 100%;
}

#inspire {
  background: #f7f9fb !important;
}

#app-bar {
  z-index: 1;
  padding: 0;
  height: 100px !important;
}

#main-sheet {
  margin-top: -10px;
  width: 100%;
  z-index: 2;
}

.pointer {
  cursor: pointer;
}

.language-block {
  position: absolute;
  bottom: 0;
}

.wrap {
  white-space: pre-wrap;      /* CSS3 */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap;     /* Opera <7 */
  white-space: -o-pre-wrap;   /* Opera 7 */
  word-wrap: break-word;      /* IE */
}
</style>