export class MoodStone extends HTMLElement {
    #isHappy = false;
    propagator = new EventTarget();
    get isHappy() {
        return this.#isHappy;
    }
    set isHappy(nv) {
        this.#isHappy = nv;
        this.shadowRoot.querySelector('#target2').innerHTML = nv.toString();
        this.propagator.dispatchEvent(new Event('isHappy'));
    }
    #isWealthy = false;
    get isWealthy() {
        return this.#isWealthy;
    }
    set isWealthy(nv) {
        this.#isWealthy = nv;
        this.shadowRoot.querySelector('#target3').innerHTML = nv.toString();
        this.propagator.dispatchEvent(new Event('isWealthy'));
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = String.raw `
            <div id=target2></div>
            <div id=target3></div>
            <h3>Conditional Display based on host property</h3>
            <template 🎚️='on when isHappy'>
                <div id=day> What a beautiful day!</div>
            </template>

            <template 🎚️='off when isHappy = isWealthy'>
                <div id=eq>IsHappy !== isWealthy</div>
            </template>
            <be-hive></be-hive>
        `;
    }
}
customElements.define('mood-stone', MoodStone);
