import { LightningElement } from 'lwc';

export default class HelloConditionalRendering extends LightningElement {

    isVisible = false
    name
    //when we click the button
    handleClick ()
    {
        this.isVisible = true
    }
    //when we type hello
    changeHandler(event){
        this.name = event.target.value
    }
    get helloMethod(){
        return this.name === 'hello'
    }
}