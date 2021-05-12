// eslint-disable-next-line no-unused-vars
import {abiContract, TonClient} from "@tonclient/core";
import {libWeb, libWebSetup} from "@tonclient/lib-web";
import SafeMultisig from "../contracts/SafeMultisig/SafeMultisig";
import SetCodeMultisig from "../contracts/SetCodeMultisig/SetCodeMultisig";
import Transfer from "../contracts/Transfer/Transfer";

export default class SDKClient {

    constructor (
        config = {network: {server_address: 'net.ton.dev'}},
        lib_options = {binaryURL: "tonclient.wasm"}
    ) {
        libWebSetup(lib_options);
        TonClient.useBinaryLibrary(libWeb);
        this.client = new TonClient(config);
    }

    getClient () {
        return this.client;
    }

    async generateSeed (dictionary = 1, word_count = 12) {
        return await this.client.crypto.mnemonic_from_random({dictionary, word_count}).then(({phrase}) => phrase);
    }

    async seedToKeys (seed, dictionary = 1, word_count = 12) {
        return await this.client.crypto.mnemonic_derive_sign_keys({phrase:seed, dictionary, word_count});
    }

    async generateAddress (keys, contract = "SafeMultisig") {
        contract = this.getContractByName(contract);

        if (!contract.abi || !contract.tvc)
            return false;

        return (await this.client.abi.encode_message({
            abi: abiContract(contract.abi),
            deploy_set: {
                tvc: contract.tvc,
                initial_data: {}
            },
            call_set: {
                function_name: 'constructor',
                input: {owners: [`0x${keys.public}`], reqConfirms: 1}
            },
            signer: {
                type: 'Keys',
                keys: keys
            }
        })).address;
    }

    async chacha20Encrypt (text, password) {
        const key = await this.client.crypto.sha256({data: btoa(password)}).then(({hash}) => hash);
        const nonce = this.base64ToHex(await this.client.crypto.generate_random_bytes({length: 12}).then(({bytes}) => bytes));

        const data = await this.client.crypto.chacha20({data: btoa(text), key, nonce}).then(({data}) => data);
        return {data, nonce};
    }

    async chacha20Decrypt (text, password, nonce) {
        const key = await this.client.crypto.sha256({data: btoa(password)}).then(({hash}) => hash);
        return atob(await this.client.crypto.chacha20({data: text, key, nonce}).then(({data}) => data));
    }

    async deploy (keys, contract = "SafeMultisig") {
        contract = this.getContractByName(contract);

        return await this.client.processing.process_message({
            send_events: false,
            message_encode_params: {
                abi: {
                    type: 'Contract',
                    value: contract.abi
                },
                deploy_set: {
                    tvc: contract.tvc,
                    initial_data: {}
                },
                call_set: {
                    function_name: 'constructor',
                    input: {
                        owners: [`0x${keys.public}`],
                        reqConfirms: 0
                    }
                },
                signer: {
                    type: 'Keys',
                    keys
                },
                processing_try_index: 1
            }
        });
    }

    async send (keys, to, amount, comment = "", contract = "SafeMultisig") {
        contract = this.getContractByName(contract);

        const body = (await this.client.abi.encode_message_body({
            abi: abiContract(Transfer.abi),
            call_set: {
                function_name: "transfer",
                input: {
                    comment: Buffer.from(comment).toString("hex"),
                },
            },
            is_internal: true,
            signer: { type: 'None' },
        })).body;

        return await this.client.processing.process_message({
            send_events: false,
            message_encode_params: {
                abi: {
                    type: 'Contract',
                    value: contract.abi
                },
                deploy_set: {
                    tvc: contract.tvc,
                    initial_data: {}
                },
                call_set: {
                    function_name: 'submitTransaction',
                    input: {
                        dest: to,
                        value: amount * 1000000000,
                        bounce: false,
                        allBalance: false,
                        payload: body,
                    }
                },
                signer: {
                    type: 'Keys',
                    keys
                },
                processing_try_index: 1
            }
        });
    }

    async decodeMessageBody (body) {
        return (await this.client.abi.decode_message_body({
            abi: abiContract(Transfer.abi),
            body: body,
            is_internal: true,
        })).value.comment;
    }

    async getBalance (address) {
        const result = (await this.client.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    eq: await address,
                },
            },
            result: "balance",
        })).result;


        if (result.length !== 0 && (typeof result[0].balance !== "undefined")) {
            return (result[0].balance);
        }

        return null;
    }

    async idDeployed (address) {
        const result = (await this.client.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    eq: address,
                },
            },
            result: "code",
        })).result;

        return (result.length) && (result[0].code !== null);
    }

    async getAccount (address) {
        return (await this.client.net.query_collection({
            collection: "accounts",
            filter: {
                id: {
                    eq: address,
                },
            },
            result: "id balance code_hash",
        })).result;
    }

    async getTransactions (address) {
        return (await this.client.net.query_collection({
            collection: "transactions",
            filter: {
                account_addr: {
                    eq: address,
                },
            },
            orderBy: [{path: "now", direction: "DESC"}],
            result: "id account_addr balance_delta now tr_type tr_type_name",
        })).result;
    }

    async getMessages (address) {
         const dst = (await this.client.net.query_collection({
            collection: "messages",
            filter: {
                dst: {
                    eq: address,
                },
            },
            orderBy: [{path: "created_at", direction: "DESC"}],
            result: "id dst src value created_at body msg_type",
        })).result;

        const src = (await this.client.net.query_collection({
            collection: "messages",
            filter: {
                src: {
                    eq: address,
                },
            },
            orderBy: [{path: "created_at", direction: "DESC"}],
            result: "id dst src value created_at body msg_type",
        })).result;

        let messages = dst.concat(src);

        for (let index in messages) {
            messages[index].decoded_body = null;
            if (!messages[index].msg_type) {
                messages[index].decoded_body = this.hexToA(await this.decodeMessageBody(messages[index].body));
            }
        }

        return messages;
    }

    getContractByName (contract) {
        return (contract === "SafeMultisig") ? SafeMultisig :
                (contract === "SetCodeMultisig") ? SetCodeMultisig :
                    SafeMultisig;
    }

    base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toUpperCase();
    }

    hexToA(hexx) {
        if (hexx === null) return;
        let hex = hexx.toString();
        let str = '';
        for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}