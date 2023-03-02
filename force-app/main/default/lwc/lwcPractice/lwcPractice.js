import { LightningElement,track } from 'lwc';
//Class consists of properties and methods
export default class LwcPractice extends LightningElement {
    fullname = "Zero to Hero"
    title = "aura"
    //two way handle
    cangeHandler(event)
    {
      this.title = event.target.value
    }

     @track address={
        city: 'Melborn',
        postcode : 3000,
        country:'indilollllb'
    }
//without track handler
    trackHandler(event){
        this.address={...this.address, "city":event.target.value}
    }

    //getter
    user = ["sid","shailesh"]
    num1 = 1
    num2 = 2
    get firstname(){
      return this.user[0]
    }

    get multiplication(){
      return this.num1*this.num2
    }
    //methods
   // getName(){
        //performlogic
   // }


}