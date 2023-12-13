import { LightningElement, api, track, wire } from 'lwc';
import getAllServiceAtFacility from '@salesforce/apex/ProgramSearchFacilities.getAllServiceAtFacility';
import getAllServiceAtFacilityWithoutParam from '@salesforce/apex/ProgramSearchFacilities.getAllServiceAtFacilityWithoutParam';
import Picnic_Shelter from "@salesforce/label/c.Picnic_Shelter";
import Calendar_URL from "@salesforce/label/c.Calendar_URL";
import Campsite from "@salesforce/label/c.Campsite";

export default class ProgramSearch extends LightningElement {
    
    searchText;
    filteredRecords;
    siteTargetURL = (window.location.href).substr(0, (window.location.href).indexOf('/s'))+'/s'+'/calendar?servicesAtFacilityId=';
    siteTargetURLPicnic = (window.location.href).substr(0, (window.location.href).indexOf('/s'))+'/s' +'/picnic?servicesAtFacilityId=';
    siteTargetURLCampsite = (window.location.href).substr(0, (window.location.href).indexOf('/s'))+'/s' +'/campsite?servicesAtFacilityId=';


    connectedCallback(){
        getAllServiceAtFacilityWithoutParam()
        .then(result=>{
            console.log('inside callback ',JSON.stringify(result));
            this.filteredRecords = result;              

        })
        .catch(error=>{
               this.error = error;
               this.data =undefined;
        })


    }

    
    handleSearchChange(event) {
        this.searchText = event.target.value;
        console.log('event = '+JSON.stringify(event.target.value));
        console.log('searchtext = '+JSON.stringify(this.searchText));
    }

    
    handleSearchClick() {
        getAllServiceAtFacility({searchKey: this.searchText })
        .then(result => {
         console.log('result inside method = ',JSON.stringify(result));
         this.filteredRecords = result;              

        })
        .catch(error => {
            this.error = error;
            this.data = undefined;
        }
        );
    }

    getRecordUrl(recordId) {
        return this.siteTargetURL + recordId;
    }

    get recordsWithUrls() {
        if (this.filteredRecords) {
            return this.filteredRecords.map(record => {
                let url;
                if (record.Name.includes('Picnic')) {
                    url = this.siteTargetURLPicnic + record.Id;
                } else if (record.Name.includes('Campsite')) {
                    url = this.siteTargetURLCampsite + record.Id;
                } else {
                    url = this.getRecordUrl(record.Id);
                }
                return {
                    ...record,
                    url: url
                };
            });
        } else {
            return [];
        }
    }
}
