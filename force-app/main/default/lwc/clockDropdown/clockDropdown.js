import { LightningElement, api } from 'lwc';

export default class ClockDropdown extends LightningElement {

    @api label = ''
    @api options = []
    @api uniqueId = ''
    changeHandler(event){
        console.log(this.label)
        console.log(event.target.value)
        this.callParent(event.target.value)
    }

    callParent(){
        this.dispatchEvent(new CustomEvent('optionHandler' ,{ 
        detail: {
            label:this.label,
            value:value
        }
        }))
    }
}