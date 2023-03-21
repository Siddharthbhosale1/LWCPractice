import { LightningElement,wire } from 'lwc';
import SAMPLEMC from "salesforce/messageChannel/SampleMessageChannel__c"
import { subscribe, MessageContext } from 'lightning/messageService';
export default class LmsComponentX extends LightningElement {
    @wire(MessageContext)
        context

        subscribe()
    
}