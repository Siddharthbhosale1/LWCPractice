import { LightningElement } from 'lwc';
//Car__c Schema

import NAME_FIELD from '@salesforce/schema/cars__c.Name'
import Picture_URL__c from '@salesforce/schema/cars__c.Picture_URL__c'
import CATEGORY_FIELD from '@salesforce/schema/cars__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/cars__c.Make__c'
import MSRP_FIELD from 'salesforce/schema/cars__c.MSRP__c'
import FUEL_FIELD from 'salesforce/schema/cars__c.Fuel_Type__c'
import SEAT_FIELD from 'salesforce/schema/cars__c.Number_of_Seats__c'
import CONTROL_FIELD from 'salesforce/schema/cars__c.Control__c'
export default class CarCard extends LightningElement {}

//Picture_URL__c