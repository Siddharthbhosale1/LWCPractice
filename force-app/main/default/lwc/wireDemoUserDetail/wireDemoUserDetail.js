import { LightningElement , wire } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi'
import Id from '@salesforce/user/Id'
export default class WireDemoUserDetail extends LightningElement {
    userId = Id
    //0055j0000051nhlAAA

   // @wire(adapter , {adapterConfig})
   // propertyoffunction
   userDetails
@wire(getRecord, {recordId:'0055j0000051nhlAAA',fields:['User.Name', 'User.Email']})
userDetailHandler({data,error}){
    if(data){
       this.userDetails = data.fields 
    }
    if(error){
        console.error(error)
    }
  }

  @wire(getRecord, {recordId:'0055j0000051nhlAAA',fields:['User.Name', 'User.Email']})
  userDetailProperty
}