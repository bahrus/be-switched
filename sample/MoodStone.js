export class MoodStone extends HTMLElement {
    #isHappy = false;
    get isHappy() {
        return this.#isHappy;
    }
    set isHappy(nv) {
        this.#isHappy = nv;
        this.shadowRoot.innerHTML = nv.toString();
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}
customElements.define('mood-stone', MoodStone);
