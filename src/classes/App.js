import SDKClient from "@/classes/SDKClient";
import VuexLocalStorage from "@/classes/VuexLocalStorage";

export default class App {
    static #sdk_client;

    static init () {
        VuexLocalStorage.init();

        this.#sdk_client = new SDKClient({
            network: { server_address: VuexLocalStorage.getSettings('network', 'net.ton.dev') }
        });

        const accounts_id = VuexLocalStorage.getAccountsId();
        if (accounts_id.length > 0) {
            this.unsubscribe();
            this.subscribeToAccounts(VuexLocalStorage.getAccountsId(), VuexLocalStorage.setAccount);
            this.subscribeToTransactions(VuexLocalStorage.getAccountsId(), VuexLocalStorage.setTransaction);
            this.subscribeToMessages(VuexLocalStorage.getAccountsId(), VuexLocalStorage.setMessage);

            for (let index in accounts_id) {
                this.updateAccountData(accounts_id[index]);
            }
        }
    }

    static sdk () {
        return this.#sdk_client;
    }

    static setNetwork (network) {
        VuexLocalStorage.setSettings('network', network);
        VuexLocalStorage.setTransactions({});
        VuexLocalStorage.setMessages({});
        this.init();
    }

    static setUser (user) {
        VuexLocalStorage.setAuth(user);
        this.init();
    }

    static async subscribeToAccounts (accounts, handler) {
        await this.sdk().client.net.subscribe_collection({
            collection: "accounts",
            filter: {
                id: {in: accounts},
            },
            result: "id code_hash balance",
        },
            function (tick) {
            console.log(tick, '>>> accounts tick');
            if (tick) {
                handler(tick.result, ['code_hash', 'balance']);
            }
        });
    }

    static async subscribeToTransactions (accounts, handler) {
        await this.sdk().client.net.subscribe_collection({
            collection: "transactions",
            filter: {
                account_addr: {in: accounts},
            },
            result: "id account_addr balance_delta now tr_type tr_type_name",
        },
            function (tick) {
            console.log(tick, '>>> transactions tick');
            if (tick) {
                handler({
                    id: tick.result.id,
                    account_id: tick.result.account_addr,
                    balance_delta: tick.result.balance_delta,
                    time: tick.result.now,
                    type: tick.result.tr_type,
                }/*, ['id', 'account_id', 'balance_delta', 'time', 'type']*/);
            }
        });
    }

    static async subscribeToMessages (accounts, handler) {
        await this.sdk().client.net.subscribe_collection({
            collection: "messages",
            filter: {
                dst: {in: accounts},
            },
            result: "id dst src value body created_at",
        },
            function (tick) {
            console.log(tick, '>>> messages tick dst');
            if (tick) {
                handler({
                    id: tick.result.id,
                    dst: tick.result.dst,
                    src: tick.result.src,
                    value: tick.result.value,
                    body: tick.result.body,
                    msg_type: tick.result.msg_type,
                    created_at: tick.result.created_at,
                    decoded_body: tick.result.decoded_body,
                });
            }
        });

        await this.sdk().client.net.subscribe_collection({
                collection: "messages",
                filter: {
                    src: {in: accounts},
                },
                result: "id dst src value body created_at",
            },
            function (tick) {
                console.log(tick, '>>> messages tick src');
                if (tick) {
                    handler({
                        id: tick.result.id,
                        dst: tick.result.dst,
                        src: tick.result.src,
                        value: tick.result.value,
                        body: tick.result.body,
                        msg_type: tick.result.msg_type,
                        created_at: tick.result.created_at,
                    });
                }
            });
    }

    static async unsubscribe (handle = 0) {
        await this.sdk().client.net.unsubscribe({handle});
    }

    static async updateAccountData (account) {
        this.sdk().getAccount(account).then((_account) => {
            if (_account.length) {
                VuexLocalStorage.setAccount({
                    id: _account[0].id,
                    balance: _account[0].balance,
                    code_hash: _account[0].code_hash,
                }, ['code_hash', 'balance']);
            } else {
                VuexLocalStorage.setAccount({
                    id: account,
                    balance: 0,
                    code_hash: null,
                }, ['code_hash', 'balance']);
            }
        });

        this.sdk().getTransactions(account).then((transactions) => {
            if (transactions.length) {
                for (let index in transactions) {
                    VuexLocalStorage.setTransaction({
                        id: transactions[index].id,
                        account_id: transactions[index].account_addr,
                        balance_delta: transactions[index].balance_delta,
                        time: transactions[index].now,
                        type: transactions[index].tr_type,
                    });
                }
            }
        });

        this.sdk().getMessages(account).then((messages) => {
            if (messages.length) {
                for (let index in messages) {
                    VuexLocalStorage.setMessage({
                        id: messages[index].id,
                        dst: messages[index].dst,
                        src: messages[index].src,
                        value: messages[index].value,
                        body: messages[index].body,
                        msg_type: messages[index].msg_type,
                        created_at: messages[index].created_at,
                        decoded_body: messages[index].decoded_body,
                    });
                }
            }
        });
    }
}