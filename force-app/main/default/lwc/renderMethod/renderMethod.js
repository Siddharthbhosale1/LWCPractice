import { LightningElement } from 'lwc';
import signIn from './signIn.html'
import signUp from './signUp.html'
import renderMethod from './renderMethod.html'
export default class RenderMethod extends LightningElement {
    selectedBtn
    render(){
        return this.selectedBtn === 'Signup' ? signUp :
            this.selectedBtn === 'Signin' ? signIn :
            renderMethod
    }
    handleClick(event){
        this.selectedBtn = event.target.label
    }

    submitHandler(event){
        console.log(`${event.target.label} Successfully`)
    }
}