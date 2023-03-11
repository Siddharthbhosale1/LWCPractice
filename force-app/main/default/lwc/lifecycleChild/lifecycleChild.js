import { LightningElement } from 'lwc';

export default class LifecycleChild extends LightningElement {
    constructor(){
        super()
        console.log("Child constructor call")
    }
    connectedCallback(){
        console.log("Child connectedCallback")
        throw new Error('Loading of child component field ')
    }
    renderedCallback(){
        console.log("Child renderdCallback")
    }
    disconnectedCallback(){
        alert('Child disconnectedCallback called!!')
    }
}