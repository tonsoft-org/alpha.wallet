import Vue from 'vue'
import VueRouter from 'vue-router'
import MainIndex from "@/views/Main/MainIndex";
import VuexLocalStorage from "@/classes/VuexLocalStorage";
import Login from "@/views/Auth/Login";
import About from "@/views/About";
import Registration from "@/views/Auth/Registration";
import AccountCreate from "@/views/Accounts/AccountCreate";
import AccountShow from "@/views/Accounts/AccountShow";
import AccountShowSeed from "@/views/Accounts/AccountShowSeed";
import AccountSend from "@/views/Accounts/AccountSend";
import AccountImport from "@/views/Accounts/AccountImport";
import AccountSent from "@/views/Accounts/AccountSent";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'main.index',
    component: MainIndex
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/accounts/create',
    name: 'accounts.create',
    component: AccountCreate
  },
  {
    path: '/accounts/import',
    name: 'accounts.import',
    component: AccountImport
  },
  {
    path: '/accounts/:id',
    name: 'accounts.show',
    component: AccountShow,
    props: true,
  },
  {
    path: '/accounts/:id/seed',
    name: 'accounts.show.seed',
    component: AccountShowSeed,
    props: true,
  },
  {
    path: '/accounts/:id/send',
    name: 'accounts.send',
    component: AccountSend,
    props: true,
  },
  {
    path: '/accounts/:id/sent/:transaction_id',
    name: 'accounts.sent',
    component: AccountSent,
    props: true,
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const auth = VuexLocalStorage.getAuth();

  if (
      !auth &&
      (to.name !== 'login') &&
      (to.name !== 'registration')
  ) {
    return next({ name: 'login', query: { returnUrl: to.path } });
  }

  next();
});

export default router;
