import { LightningElement } from 'lwc';
import pubsub from 'c/pubsub';
export default class PubsubComponentB extends LightningElement {
    message
    //for on load functionality
    connectedCallback(){
       this.callSubscriber()
    }

   callSubscriber(){
        pubsub.subscribe('componentA',(message)=>{
            this.message=message
        })
    }
}