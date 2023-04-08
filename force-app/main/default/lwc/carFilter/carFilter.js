import { LightningElement } from 'lwc';

export default class CarFilter extends LightningElement {
    filters={
        searckKey:'',
        maxPrice:999999
    }
    handleSearchKeyChange(){}
    handleMaxPriceChange(){}
}