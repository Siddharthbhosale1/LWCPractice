import { LightningElement, api } from 'lwc';

export default class ClockDropdown extends LightningElement {

    @api label = ''
    @api options = []
    @api uniqueId = ''
    changeHandler(event){
        console.log(this.label)
        console.log(event.target.value)
        this.callParent(event.target.value) // passing event.target.value to callParent
    }

    callParent(value){ // value is now a parameter
        this.dispatchEvent(new CustomEvent('optionHandler' ,{ 
        detail: {
            label:this.label,
            value:value // using the passed value
        }
        }))
    }
}
