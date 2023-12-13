import { LightningElement, wire } from 'lwc';
import getRecords from '@salesforce/apex/YourController.getRecords';

export default class TreeBasic extends LightningElement {
    items = [];
    @wire(getRecords)
    wiredRecords({ error, data }) {
        if (data) {
            this.items = this.processData(data);
        } else if (error) {
            console.error(error);
        }
    }

    processData(data) {
        let items = [];
    for(let i = 0; i < data.length; i++) {
        console.log('Record: ', data[i]);
        let item = {
            label: data[i].Name, // replace with your field
            name: data[i].Id,
            items: []
        };
        if(data[i].ABPractice__r && Array.isArray(data[i].ABPractice__r)&& data[i].ABPractice__r.length > 0) {
            item.items = this.processData(data[i].ABPractice__r);
        }
        items.push(item);
    }
    return items;
    }
}
