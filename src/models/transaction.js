import { Model } from '@vuex-orm/core'

export default class Transaction extends Model {
    static entity = 'transactions';
    static primaryKey = 'id';

    static fields () {
        return {
            id: this.attr(null),
            account_id: this.attr(null),
            balance_delta: this.attr(null),
            time: this.attr(null),
            type: this.attr(null),
        }
    }
}
