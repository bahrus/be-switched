export class MoodStone extends HTMLElement{
    #isHappy = false;
    get isHappy(){
        return this.#isHappy;
    }
    set isHappy(nv: boolean){
        this.#isHappy = nv;
        this.shadowRoot!.querySelector('#target2')!.innerHTML = nv.toString();
    }
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.shadowRoot!.innerHTML = String.raw `
            <div id=target2></div>
            <template be-switched='on when /isHappy.'>
                <my-content></my-content>
            </template>
            <be-hive></be-hive>
        `;
    }

}

customElements.define('mood-stone', MoodStone);