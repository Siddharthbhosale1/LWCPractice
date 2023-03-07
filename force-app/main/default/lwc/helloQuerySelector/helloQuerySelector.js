import { LightningElement } from 'lwc';

export default class HelloQuerySelector extends LightningElement {
    userName = ["John" , "Smith" , "Jenny"]
    fetchDetailHandler(){
        const elem = this.template.querySelector('h1')
        elem.style.border="1px solid red";
        console.log(elem.innerText)
        const userElement = this.template.querySelectorAll('.name');
        
        Array.from(userElement).forEach(item=>{
            console.log(item.innerText)
        })

        ////lwc:dom="manual" demo
        const childElem = this.template.querySelector('.child')
        childElem.innerHTML = '<p>hey im a child</p>'
    }

}