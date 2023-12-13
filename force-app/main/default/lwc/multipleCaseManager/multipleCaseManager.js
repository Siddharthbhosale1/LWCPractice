import { LightningElement, wire, track } from 'lwc';
import fetchUserRecords from '@salesforce/apex/fetchUserRecords.fetchUserRecords'
import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import SUBJECT_FIELD from '@salesforce/schema/Account.User__c';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class MultiSelectPicklist extends LightningElement {
    // lstSelected = [];
     options = [];
     selectedUsers = [];
   // userDetails;

   @wire(fetchUserRecords) 
   Users({ error, data }) {
    if (data) {
        this.options = data.map(user => {
            return {
                label: user.Name,
                value: user.Id
            };
        });
    } else if (error) {
        console.error(error);
    }
}

handleChange(event){
     this.selectedUsers = event.detail.value;
     }
    

    saveChanges() {
        // use this.selectedFields to save them in a field or perform any other logic
        // for example, you can use an apex method to update a record with the selected fields
        updateRecord({ // invoke the apex method with the parameters
            recordId: this.recordId, // pass the record id
            selectedFields: this.selectedFields // pass the selected fields
        })
        .then(result => { // handle the result
            // show a success message or do something else
        })
        .catch(error => { // handle the error
            // show an error message or do something else
        });
    }




}