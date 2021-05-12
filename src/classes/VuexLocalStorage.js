export default class VuexLocalStorage {

    static init () {
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        if (!vuex || typeof vuex.entities === "undefined") {
            this.resetVuex({auth: {}, entities: { accounts: {}, messages: {}, transactions: {}, settings: {} }});
        }
    }

    static resetVuex (state = {}) {
        localStorage.setItem('vuex', JSON.stringify(state));
        window.dispatchEvent(new CustomEvent('storage_updated', {detail: JSON.parse(localStorage.getItem('vuex'))}));
    }

    /* Accounts */

    static getAccounts () {
        const user_id = this.getAuth()?.id ?? false;
        const accounts = (JSON.parse(localStorage.getItem(('vuex'))))?.entities?.accounts?.data ?? false;

        if (!user_id || !accounts) {
            return {};
        }

        let user_accounts = {};
        for (let id in accounts) {
            if (accounts[id].user_id === user_id) {
                user_accounts[id] = accounts[id];
            }
        }

        return user_accounts;
    }

    static getAccountsId () {
        return Object.keys(this.getAccounts());
    }

    static setAccount (account, fields = null) {
        if (!account) return false;
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        let accounts = vuex?.entities?.accounts?.data ?? {};

        if (fields !== null) {
            for (let index in fields) {
                accounts[account.id][fields[index]] = account[fields[index]];
            }
        } else {
            accounts[account.id] = account;
        }

        if (typeof vuex.entities.accounts === "undefined") vuex.entities.accounts = {};

        vuex.entities.accounts.data = accounts;
        return VuexLocalStorage.resetVuex(vuex);
    }


    /* Transactions */

    static getTransactions () {
        return (JSON.parse(localStorage.getItem(('vuex'))))?.entities?.transactions?.data ?? {};
    }

    static setTransaction (transaction) {
        if (!transaction) return false;
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        let transactions = vuex?.entities?.transactions?.data ?? {};
        transactions[transaction.id] = transaction;
        if (typeof vuex.entities.transactions === "undefined") vuex.entities.transactions = {};
        vuex.entities.transactions.data = transactions;
        return VuexLocalStorage.resetVuex(vuex);
    }

    static setTransactions (transactions) {
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        vuex.entities.transactions.data = transactions;
        return VuexLocalStorage.resetVuex(vuex);
    }


    /* Messages */

    static getMessages () {
        return (JSON.parse(localStorage.getItem(('vuex'))))?.entities?.transactions?.data ?? {};
    }

    static setMessage (message) {
        if (!message) return false;
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        let messages = vuex?.entities?.messages?.data ?? {};
        messages[message.id] = message;
        if (typeof vuex.entities.messages === "undefined") vuex.entities.messages = {};
        vuex.entities.messages.data = messages;
        return VuexLocalStorage.resetVuex(vuex);
    }

    static setMessages (messages) {
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        vuex.entities.messages.data = messages;
        return VuexLocalStorage.resetVuex(vuex);
    }

    /* Settings */

    static getSettings (setting = null, default_value = null) {
        const vuex = (JSON.parse(localStorage.getItem(('vuex'))))?.settings?.data ?? [];

        if (setting !== null) {
            if (typeof vuex[setting] !== "undefined") {
                return vuex[setting];
            }

            return default_value;
        }

        return vuex ?? default_value;
    }

    static setSettings (setting, value) {
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        let settings = vuex?.settings?.data ?? {};
        settings[setting] = value;
        if (typeof vuex.settings === "undefined") vuex.settings = {};
        vuex.settings.data = settings;
        return this.resetVuex(vuex);
    }


    /* Auth */

    static getAuth () {
        return (JSON.parse(localStorage.getItem(('vuex'))))?.auth?.data ?? null;
    }

    static setAuth (value) {
        let vuex = (JSON.parse(localStorage.getItem(('vuex'))));
        vuex.auth = {data: value};
        return this.resetVuex(vuex);
    }
}