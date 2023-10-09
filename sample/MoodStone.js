export class MoodStone extends HTMLElement {
    #isHappy = false;
    get isHappy() {
        return this.#isHappy;
    }
    set isHappy(nv) {
        this.#isHappy = nv;
        this.shadowRoot.querySelector('#target2').innerHTML = nv.toString();
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = String.raw `
            <div id=target2></div>
            <h3>Example 4a</h3>
            <template be-switched='on when /isHappy.'>
                <my-content></my-content>
            </template>

            <h3>Example 4b</h3>
            <template be-switched='on when is happy.'>
                <my-content-2></my-content-2>
            </template>
            <be-hive></be-hive>
        `;
    }
}
customElements.define('mood-stone', MoodStone);
