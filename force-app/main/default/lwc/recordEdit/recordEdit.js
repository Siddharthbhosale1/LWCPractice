import { LightningElement } from 'lwc';
import CONTACT_OBJECT from '@salesforce/schema/Contact'
import NAME_FIELD from'@salesforce/schema/Contact.Name'
import TITLE_FIELD from'@salesforce/schema/Contact.Title'
import PHONE_FIELD from'@salesforce/schema/Contact.Phone'
import EMAIL_FIELD from'@salesforce/schema/Contact.Email'
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId'
export default class RecordEdit extends LightningElement {
objectName = CONTACT_OBJECT
field={

    accountfield : ACCOUNT_FIELD,
    nameField : NAME_FIELD,
    titleField : TITLE_FIELD,
    phoneFiled : PHONE_FIELD,
    emailField : EMAIL_FIELD

}



}