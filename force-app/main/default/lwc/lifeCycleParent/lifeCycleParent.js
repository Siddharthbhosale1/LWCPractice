import { LightningElement } from 'lwc';

export default class LifeCycleParent extends LightningElement {
    isChildVisible = false
    constructor(){
        super()
        console.log("parent constructor call")
    }
    connectedCallback(){
        console.log("parent connectedCallback")
    }
   handlerClick(){
    this.isChildVisible = !this.isChildVisible
   }
   errorCallback(error, stack){
    console.log(error.message)
    console.log(stack)
   }
}