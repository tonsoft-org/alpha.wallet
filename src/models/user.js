import { Model } from '@vuex-orm/core'
import Account from "@/models/account";

export default class User extends Model {
    static entity = 'users';

    static fields () {
        return {
            id: this.uid(() => this.uuid()),
            name: this.attr(null),
            password: this.attr(null),
            nonce: this.attr(null),

            accounts: this.hasMany(Account, 'user_id', 'id'),
        }
    }

    static uuid () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
