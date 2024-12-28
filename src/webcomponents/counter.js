const names = {
    count: 'count'
}

class MyCounter extends HTMLElement {
    constructor() {
        super()
        //shadow dom, allows no conflict of this component reusing in page
        this.shadow = this.attachShadow({mode: 'open'})
    }

    static get observedAttributes() {
        return [names.count]
    }

    get count() {
        return this.getAttribute(names.count)
    }

    set count(val) {
        this.setAttribute(names.count, val)
    }

    syncup() {
        this.render()
        let incBtn = this.shadow.getElementById('btnincrement')
        let decBtn = this.shadow.getElementById('btndecrement')
        incBtn.addEventListener('click', ()=> this.count++)
        decBtn.addEventListener('click', ()=>this.count--)
    }

    connectedCallback() {
        //when this component added to page, this gets called
        this.syncup()
    }

    attributeChangedCallback(prop, oldVal, newVal) {
        if (prop === names.count) this.syncup()
    }

    render() {
        this.shadow.innerHTML = `
            <h1>dp Counter - ${this.getAttribute(names.count)}</h1>
            <h3>${this.count}</h3>
            <button id='btnincrement'>Increment</button>
            <button id='btndecrement'>Decrement</button>
        `
    }
    static get tag(){
        return 'my-counter'
    }
}

window.customElements.define(MyCounter.tag, MyCounter)