import { LightningElement, track,api } from 'lwc';
import getAccountData from '@salesforce/apex/SearchResume.getAccountData';
import { NavigationMixin } from 'lightning/navigation';
//import getAttachmentData from '@salesforce/apex/SearchResume.getAttachmentData';


export default class CustomRecordSearch extends NavigationMixin(LightningElement) {
    searchKey;
    @track accounts;
    @api recordId;
    pageNumber;
   
    //This Funcation will get the value from Text Input.
    handelSearchKey(event){
        this.searchKey = event.target.value;
    }

    //This funcation will fetch the Account Name on basis of searchkey
    SearchAccountHandler(){
        //call Apex method.
        this.pageNumber = 1;
        getAccountData({textkey: this.searchKey})
        .then(result => {
                this.accounts = result;
               
        })
        .catch( error=>{
            this.accounts = null;
        });

    }
    cols = [
             {label:'Resume Name', fieldName: 'resumeLink', 
             type:'url', typeAttributes: {
                tooltip: { fieldName: 'Name' }, label: { fieldName: 'name' }, target: '_blank'} },
              //{label:'Skills', fieldName: 'skills' , type:'text'} ,
            //  {label:'Document Name', fieldName: 'Resume_Document__c' , type:'text'} ,
             // {label:'Resume ', fieldName: 'docUrl' , type:'url', typeAttributes: {
              //   label: { fieldName: 'docName' }
              {label:'Resume Data', fieldName: 'resumeData' , type:'text'
               }
                //{label:'Resume ', fieldName: 'docUrl' , type:'url', typeAttributes: {
                 //label: { fieldName: 'docName' }}}
         ]
         
         handleNavigate(event) {
            Console.log('ID',this.accounts);
            const action = event.detail.action;

            const row = event.detail.row;
            console.log('value of rows is : '+row);
            this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        objectApiName: 'Resume__c',
                        actionName: 'view'
                    },
                 });
            

            // var url = 'https://cloudsynappsinc-4b-dev-ed.lightning.force.com/lightning/r/Resume__c/a6r5g000000cNB9AAM/view';
            // window.location.href = url;
            // this[NavigationMixin.Navigate]({
            //     type: 'standard__recordPage',
            //     attributes: {
            //         recordId: this.recordId,
            //         objectApiName: 'Resume__c',
            //         actionName: 'view'
            //     },
            //  });
    
    
    
        }
}