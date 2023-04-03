import { LightningElement , wire } from 'lwc';
import {getRecord} from 'lightning/uiRecordApi'
import Id from '@salesforce/user/Id'
import NAME_FIELD from'@saledforce/schema/User.Name'
import EMAIL_FIELD from'@saledforce/schema/Email.Name'
//const fields = []
export default class WireDemoUserDetail extends LightningElement {
    userId = Id
    //0055j0000051nhlAAA

   // @wire(adapter , {adapterConfig})
   // propertyoffunction
   userDetails
@wire(getRecord, {recordId:'0055j0000051nhlAAA',fields:[NAME_FIELD, EMAIL_FIELD]})
userDetailHandler({data,error}){
    if(data){
       this.userDetails = data.fields 
    }
    if(error){
        console.error(error)
    }
  }

  @wire(getRecord, {recordId:'0055j0000051nhlAAA',fields:[NAME_FIELD, EMAIL_FIELD]})
  userDetailProperty
}