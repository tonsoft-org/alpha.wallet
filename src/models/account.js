import { Model } from '@vuex-orm/core'
import Transaction from "@/models/transaction";

export default class Account extends Model {
    static entity = 'accounts';
    static primaryKey = 'id';

    static fields () {
        return {
            id: this.attr(null),
            user_id: this.attr(null),
            seed: this.attr(null),
            nonce: this.attr(null),
            balance: this.attr(null),
            code_hash: this.attr(null),
            contract: this.attr(null),
            deployed: this.attr(null),

            transactions: this.hasMany(Transaction, 'account_id', 'id'),
        }
    }
}
