const template = document.createElement('template')

template.innerHTML = `
<style>
    .user-card{
        font-family: 'Arial';
        background: #f4f4f4;
        width: 700px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-gap: 10px;
        margin-bottom: 15px;
        border-bottom: darkorchid 5px solid;
    }
    .user-card img{
        width: 100%;
    }
    .user-card button{
        cursor: pointer;
        background: darkorchid;
        color: #fff;
        border: 0;
        border-radius: 5px;
        padding: 5px 10px;
    }
</style>
<div class="user-card">
    <img/>
    <div>
        <h3></h3>
        <div class='info'>
            <p>Email: <slot name='email'/> </p>
            <p>Phone: <slot name='phone'/> </p>
        </div>
        <button id='toggle-info'>Hide Info</button>
    </div>
</div>
`

class UserCard extends HTMLElement {
    constructor() {
        super();
        this.showInfo=true
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.querySelector('h3').innerHTML = this.getAttribute('name')
        this.shadowRoot.querySelector('img').src = this.getAttribute('avatar')
        this.infoBtn=this.shadowRoot.getElementById('toggle-info')
    }
    toggleInfo(){
        let info=this.shadowRoot.querySelector('.info')
        if(!this.showInfo){
            info.style.display='block'
            this.infoBtn.innerHTML='Hide Info'
            this.infoBtn.style.backgroundColor='darkorchid'
        }else{
            info.style.display='none'
            this.infoBtn.innerHTML='Show Info'
            this.infoBtn.style.backgroundColor='coral'
        }
        this.showInfo=!this.showInfo
    }
    connectedCallback(){
        this.infoBtn.addEventListener('click',()=>this.toggleInfo())
    }
    disconnectedCallback(){
        this.infoBtn.removeEventListener()
    }
}

window.customElements.define('user-card', UserCard)