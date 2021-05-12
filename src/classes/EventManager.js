import App from "@/classes/App";

export default class EventManager {

    static emit (event, data) {
        if (event === 'set_user') {
            App.setUser(data);
            /*chrome.runtime.sendMessage({ msg: 'set_user', data: data});*/
        }
    }

}