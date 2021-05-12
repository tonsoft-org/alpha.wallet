import { Model } from '@vuex-orm/core'

export default class Message extends Model {
    static entity = 'messages';
    static primaryKey = 'id';

    static fields () {
        return {
            id: this.attr(null),
            dst: this.attr(null),
            src: this.attr(null),
            value: this.attr(null),
            body: this.attr(null),
            msg_type: this.attr(null),
            created_at: this.attr(null),
            decoded_body: this.attr(null),
        }
    }
}
