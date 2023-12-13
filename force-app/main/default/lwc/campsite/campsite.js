import { LightningElement, track, wire, api } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import getAvaialbleSlot from '@salesforce/apex/FullCalendarController.getAvaialbleSlot';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import deleteBooking from '@salesforce/apex/FullCalendarController.deleteBooking';
import AvailableSlots from '@salesforce/apex/FullCalendarController.AvailableSlots';
import fetchServiceId from '@salesforce/apex/FullCalendarController.fetchServiceId';
import fetchServiceAtFacility from '@salesforce/apex/FullCalendarController.fetchServiceAtFacility';
import CalendarBookingMap from '@salesforce/apex/FullCalendarController.CalendarBookingMap';
import fetchUserInfo from '@salesforce/apex/FullCalendarController.fetchUserInfo';
//import blockedTimeSlots from '@salesforce/apex/FullCalendarController.blockedTimeSlots';
import lastBlockedTimeSlot from '@salesforce/apex/FullCalendarController.lastBlockedTimeSlot';
import sendEmail from '@salesforce/apex/FullCalendarController.sendEmail';
//import attendeestotal from '@salesforce/apex/FullCalendarController.attendeestotal';
import fetchClientSecret from '@salesforce/apex/CampsiteCreditCardTransaction.fetchClientSecret';
import createPaymentTransaction from '@salesforce/apex/CampsiteCreditCardTransaction.createPaymentTransaction';
import getCurrentUserContact from '@salesforce/apex/CampsiteCreditCardTransaction.getCurrentUserContact';
import successfullTransaction from '@salesforce/apex/CampsiteCreditCardTransaction.successfullTransaction';
import uploadFile from '@salesforce/apex/CampsiteCreditCardTransaction.uploadFile'
//import attachFileToRecord from '@salesforce/apex/CampsiteCreditCardTransaction.attachFileToRecord'
import fetchEvents from '@salesforce/apex/FullCalendarController.fetchEvents';
import { NavigationMixin } from 'lightning/navigation';
import tilled from '@salesforce/resourceUrl/tilled';
import paysafe from '@salesforce/resourceUrl/paysafe';
import { CurrentPageReference } from 'lightning/navigation';
//import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import TaxesLabel from '@salesforce/label/c.TaxesLabel';
import updateSignature from '@salesforce/apex/SignatureController.updateSignature';
import getCurrentMember from '@salesforce/apex/ProcessCreditCardTransaction.getCurrentMember';
import Add_Participants_Error from '@salesforce/label/c.Add_Participants_Error';
import FULL_CALESNDAR_JQUERY from '@salesforce/label/c.FullCalendarJS_jquery';
import FULL_CALESNDAR_MOMENT from '@salesforce/label/c.FullCalendarJS_moment';
import FULL_CALESNDAR_FullCalendar from '@salesforce/label/c.FullCalendarJS_fullcalendar';
import FULL_CALESNDAR_FullCalendar_CSS from '@salesforce/label/c.FullCalendarJS_fullcalendar_Css';
import getCustomMetadata from '@salesforce/apex/FullCalendarController.getWaitingDays';//Added by pranit
const columns = [
    { label: 'File Name', fieldName: 'name', hideDefaultActions: true },

    {
        label: 'Delete',
        type: 'button-icon',
        typeAttributes:
        {
            iconName: 'utility:delete',
            name: 'delete',
            iconClass: 'slds-icon-text-error'
        }
    }

];
// added by Shubham Kulkarni==> 11/07/2023 from line 51 to 53
const FIELDS = [
    'Booking_After_Zero_Slots__mdt.Max_Booking_Days__c',
];

// Global variables which is used to disable the clicking of cursor if slot value is equal to 0 
var TotalAvaialbleSlotsOnServiceFacilities;
var GreenPercentage;
var MaxCapacity;
var BookingDays;

// Below var is used to update status of booking
var bookingstatus_calendar;
export default class FullCalendarJs extends NavigationMixin(LightningElement) {

    disclaimer;
    @api recordId;
    @track signatureData;
    contentVersionIdSignature;
    contentVersionIdforDucumentOnParticipent;
    acceptedFormats = ".pdf,.png,.jpeg,.jpg";
    columns = columns;
    bookingReference;
    @track ContactId
    paymentTransaction;
    label = {
        TaxesLabel
    }
    showPopup = false;
    // added by Shubham Kulkarni==> 11/07/2023 from line 76 to 81
    // @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    // metaDataRecord;

    //  get maxDays() {
    //      return this.metaDataRecord.data.fields.Max_Booking_Days__c.value;
    //  }

    summaryTableColumns = [
        { label: 'First Name', fieldName: 'attendeefirstname', hideDefaultActions: 'true', cellAttributes: { alignment: 'center' } },
        { label: 'Last Name', fieldName: 'attendeelastname', hideDefaultActions: 'true', cellAttributes: { alignment: 'center' } },
        { label: 'Gender', fieldName: 'attendeegender', hideDefaultActions: 'true', cellAttributes: { alignment: 'center' } },
        { label: 'Age', fieldName: 'attendeeage', hideDefaultActions: 'true', cellAttributes: { alignment: 'center' }, initialWidth: 50 },
        { label: 'Email', fieldName: 'attendeeemail', hideDefaultActions: 'true', cellAttributes: { alignment: 'center' } },
        { label: 'Phone', fieldName: 'attendeephone', hideDefaultActions: 'true', cellAttributes: { alignment: 'center' } },
        { label: 'Primary?', hideDefaultActions: 'true', cellAttributes: { iconName: { fieldName: 'dynamicIcon' }, alignment: 'center' } },
        { label: 'Cost $', fieldName: 'costField', hideDefaultActions: 'true', type: 'number', typeAttributes: { minimumIntegerDigits: 2, maximumFractionDigits: 2, minimumFractionDigits: 2 } },
    ];
    // cellAttributes: { alignment: 'left' },

    summaryTableData = [{ id: 0, isRadioChecked: false, attendeefirstname: '', attendeelastname: '', attendeegender: '', attendeeage: '', attendeeemail: '', attendeephone: '' }];
    DailyVehiclePermit = 25;
    bookingReferenceId;
    isCardSelected;
    isCashSelected;
    attendeefirstname;

    attendeelastname;
    attendeegender;
    attendeeage;
    attendeeemail;
    attendeephone;
    license
    radioId = '';
    @track signature;
    @track signaturedate;
    @track disclaimerChecked = false;
    @track disclaimerReservation = false;

    @track startOptions = [
        { label: '8:00 AM', value: '08:00 AM'   },
        { label: '8:15 AM', value: '08:15 AM'   },
        { label: '8:30 AM', value: '08:30 AM'   },
        { label: '8:45 AM', value: '08:45 AM'   },
        { label: '9:00 AM', value: '09:00 AM'   },
        { label: '9:15 AM', value: '09:15 AM'   },
        { label: '9:30 AM', value: '09:30 AM'   },
        { label: '9:45 AM', value: '09:45 AM'   },
        { label: '10:00 AM', value: '10:00 AM'  },
        { label: '10:15 AM', value: '10:15 AM'  },
        { label: '10:30 AM', value: '10:30 AM'  },
        { label: '10:45 AM', value: '10:45 AM'  },
        { label: '11:00 AM', value: '11:00 AM'  },
        { label: '11:15 AM', value: '11:15 AM'  },
        { label: '11:30 AM', value: '11:30 AM'  },
        { label: '11:45 AM', value: '11:45 AM'  },
        { label: '12:00 PM', value: '12:00 PM'  },
        { label: '12:15 PM', value: '12:15 PM'  },
        { label: '12:30 PM', value: '12:30 PM'  },
        { label: '12:45 PM', value: '12:45 PM'  },
        { label: '1:00 PM', value: '1:00 PM'   },
        { label: '1:15 PM', value: '1:15 PM'   },
        { label: '1:30 PM', value: '1:30 PM'   },
        { label: '1:45 PM', value: '1:45 PM'   },
        { label: '2:00 PM', value: '2:00 PM'   },
        { label: '2:15 PM', value: '2:15 PM'   },
        { label: '2:30 PM', value: '2:30 PM'   },
        { label: '2:45 PM', value: '2:45 PM'   },
        { label: '3:00 PM', value: '3:00 PM'   },
        { label: '3:15 PM', value: '3:15 PM'   },
        { label: '3:30 PM', value: '3:30 PM'   },
        { label: '3:45 PM', value: '3:45 PM'   },
        { label: '4:00 PM', value: '4:00 PM'   },
        { label: '4:15 PM', value: '4:15 PM'   },
        { label: '4:30 PM', value: '4:30 PM'   },
        { label: '4:45 PM', value: '4:45 PM'   },
        { label: '5:00 PM', value: '5:00 PM'   },
        { label: '5:15 PM', value: '5:15 PM'   },
        { label: '5:30 PM', value: '5:30 PM'   },
        { label: '5:45 PM', value: '5:45 PM'   },
        { label: '6:00 PM', value: '6:00 PM'   },
        { label: '6:15 PM', value: '6:15 PM'   },
        { label: '6:30 PM', value: '6:30 PM'   },
        { label: '6:45 PM', value: '6:45 PM'   },
        { label: '7:00 PM', value: '7:00 PM'   }

    ];
    endOptions = [
        { label: '8:00 AM', value: '08:00 AM'   },
        { label: '8:15 AM', value: '08:15 AM'   },
        { label: '8:30 AM', value: '08:30 AM'   },
        { label: '8:45 AM', value: '08:45 AM'   },
        { label: '9:00 AM', value: '09:00 AM'   },
        { label: '9:15 AM', value: '09:15 AM'   },
        { label: '9:30 AM', value: '09:30 AM'   },
        { label: '9:45 AM', value: '09:45 AM'   },
        { label: '10:00 AM', value: '10:00 AM'  },
        { label: '10:15 AM', value: '10:15 AM'  },
        { label: '10:30 AM', value: '10:30 AM'  },
        { label: '10:45 AM', value: '10:45 AM'  },
        { label: '11:00 AM', value: '11:00 AM'  },
        { label: '11:15 AM', value: '11:15 AM'  },
        { label: '11:30 AM', value: '11:30 AM'  },
        { label: '11:45 AM', value: '11:45 AM'  },
        { label: '12:00 PM', value: '12:00 PM'  },
        { label: '12:15 PM', value: '12:15 PM'  },
        { label: '12:30 PM', value: '12:30 PM'  },
        { label: '12:45 PM', value: '12:45 PM'  },
        { label: '1:00 PM', value: '1:00 PM'   },
        { label: '1:15 PM', value: '1:15 PM'   },
        { label: '1:30 PM', value: '1:30 PM'   },
        { label: '1:45 PM', value: '1:45 PM'   },
        { label: '2:00 PM', value: '2:00 PM'   },
        { label: '2:15 PM', value: '2:15 PM'   },
        { label: '2:30 PM', value: '2:30 PM'   },
        { label: '2:45 PM', value: '2:45 PM'   },
        { label: '3:00 PM', value: '3:00 PM'   },
        { label: '3:15 PM', value: '3:15 PM'   },
        { label: '3:30 PM', value: '3:30 PM'   },
        { label: '3:45 PM', value: '3:45 PM'   },
        { label: '4:00 PM', value: '4:00 PM'   },
        { label: '4:15 PM', value: '4:15 PM'   },
        { label: '4:30 PM', value: '4:30 PM'   },
        { label: '4:45 PM', value: '4:45 PM'   },
        { label: '5:00 PM', value: '5:00 PM'   },
        { label: '5:15 PM', value: '5:15 PM'   },
        { label: '5:30 PM', value: '5:30 PM'   },
        { label: '5:45 PM', value: '5:45 PM'   },
        { label: '6:00 PM', value: '6:00 PM'   },
        { label: '6:15 PM', value: '6:15 PM'   },
        { label: '6:30 PM', value: '6:30 PM'   },
        { label: '6:45 PM', value: '6:45 PM'   },
        { label: '7:00 PM', value: '7:00 PM'   }
    ];

    keyIndex = 0;
    @track attendeeList = [
        {
            id: 0,
            attendeefirstname: '',
            attendeelastname: '',
            attendeegender: '',
            attendeeage: '',
            attendeeemail: '',
            attendeephone: '',
            license:'',
            emailclass: 'validateTwo hideemail',
            isRadioChecked: false,
            fileArray: []

        }
    ];

    con_FirstName;
    con_License;
    con_LastName;
    con_Email;
    con_Phone;
    con_gender;
    con_age;
    //To avoid the recursion from renderedcallback
    fullCalendarJsInitialised = false;

    //Fields to store the event data -- add all other fields you want to add
    title;
    startDate;
    endDate;
    startTime;
    endTime;
    activityType;
    eventDetails;

    eventCost = 0;
    taxes;
    @api eventAndTaxesCost = 0;
    eventsRendered = false;//To render initial events only once
    openSpinner = false; //To open the spinner in waiting screens
    openModal = false; //To open form
    openAttendeesModal = false; //To open form
    openDisclaimer = false;
    summaryModal = false;
    paymentModal = false;
    receiptModal = false;
    newVar = false;
    showCloseAndSummary = false;
    showClose = true;
    statesDisabled = true;
    countryValue;
    paymentMode;
    paymentDetails;

    maxlength = 16;
    pathCurrentIndex = 0;
    cardNumber;
    cardnumberoutput;
    cardname;
    cardexpiration;
    country;
    cardcvv;
    state;
    zip;
    city;
    street;

    accountId;
    publishKey;
    client_secret;

    servicesAtFacilityId = null;
    facilityId;
    isGuestUser;

    adultage
    childage
    adultcost
    isCampsite
    childcost
    infantcost
    facilityAtServiceCapacity
    blocktimelengthoncancel
    blocktimelengthonload
    startDateStore
    endDateStore
    attendeetotal
    selectedStartDate
    selectedEndDate
    splitstartDate
    errorMessage = Add_Participants_Error;
    showCloseAtt = true
    showCloseAndAddParticipants
    checkPathValidityPassed = true
    pdfUrl = '';
    @track memberId = '';
    @track
    events = []; //all calendar events are stored in this field
    @track
    blockedtimeslotsvar = [];
    @track
    slots = []; //all calendar events are stored in this field
    eventOriginalData = [];
    @track isButtonDisabled = false;
    @track noofslots1;
    showtext = false;
    paymentDone = false;

    @track isShowModal = false;
    value = 'false';

    constructor() {
        super();
        this.columns = [
            ...this.columns,
        ]
    }

    getRowActions(row, doneCallback) {
        const actions = [
            { label: 'Download', name: 'download', iconName: 'action:download' },

            {
                label: 'Delete', name: 'delete', iconName: 'action:delete'
            }

        ];
        setTimeout(() => {
            doneCallback(actions);
        }, 200);
    }


    @wire(getCurrentUserContact)
    wiredContact({ error, data }) {

        if (data) {


            console.log('datacalled' + JSON.stringify(data));
            this.con_FirstName = data.FirstName;
            this.con_License = data.vlocity_ins__DriversLicenseNumber__c;
            this.con_LastName = data.LastName;
            this.con_Email = data.Email;
            this.con_Phone = data.Phone;
            this.con_gender = data.vlocity_ins__Gender__c;
            this.con_age = data.vlocity_ins__Age__c;
            this.GetDetailsofUser();


        } else if (error) {

        }
    }

    GetDetailsofUser() {

        this.attendeefirstname = this.con_FirstName;
        this.attendeelastname = this.con_LastName;
        this.attendeeemail = this.con_Email;
        this.attendeephone = this.con_Phone;
        this.attendeegender = this.con_gender;
        this.attendeeage = this.con_age;
        this.license = this.con_License;

    }
    // This is used to fetch current page url parameters
    @wire(CurrentPageReference)
    currentPageReference;

    connectedCallback() {
        /* This connectedcallback code is used to initialize the variable which is used to disable
        the clicking of cursor if slot value is equal to 0 */
        this.servicesAtFacilityId = this.currentPageReference.state?.servicesAtFacilityId;

        getAvaialbleSlot({ serviceAtFacility: this.servicesAtFacilityId })
            .then(result => {

                TotalAvaialbleSlotsOnServiceFacilities = result[0].Capacity__c;
                GreenPercentage = result[0].Green_Percentage__c;
                MaxCapacity = result[0].Maximum_Capacity__c;
                this.disclaimer = result[0].disclaimer__c;
                console.log('value of disclaimer: ' + JSON.stringify(this.disclaimer));
                console.log('TotalAvaialbleSlotsOnServiceFacilities = ' + JSON.stringify(TotalAvaialbleSlotsOnServiceFacilities) + ' ' + JSON.stringify(GreenPercentage) + ' ' + JSON.stringify(MaxCapacity));

            })
            .catch(error => {
                this.error = error;
                this.data = undefined;
            }
            );

    }

    get options() {
        return [
            { label: 'Credit/Debit', value: 'Credit/Debit' },
            { label: 'Cash', value: 'Cash' },
        ];
    }

    get RadioOptions() {
        return [
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
        ];
    }
    Showboolean = false;
    handleChange(event) {
        this.Showboolean = true;
        this.newVar = false;
        this.openModal = false;
        this.openAttendeesModal = false;
        this.summaryModal = false;
        this.paymentModal = false;
        this.receiptModal = false;

    }



    get classes() {
        var attendeeListLength = this.attendeeList.length;
        if (attendeeListLength > 1) {
            return `slds-scrollable_y scrollableclass`;
        }
        return ``;
    }

    get modalClasses() {
        return `slds-modal__container`;

    }

    get options() {
        return [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' }
        ];
    }

    get countries() {
        return [
            { label: 'US', value: 'US' },
            { label: 'CA', value: 'CA' }
        ];
    }

    get states() {
        if (this.countryValue == 'US') {
            this.statesDisabled = false;
            return [
                { label: 'AL', value: 'AL' },
                { label: 'AK', value: 'AK' },
                { label: 'AZ', value: 'AZ' },
                { label: 'AR', value: 'AR' },
                { label: 'CA', value: 'CA' },
                { label: 'CO', value: 'CO' },
                { label: 'CT', value: 'CT' },
                { label: 'DE', value: 'DE' },
                { label: 'FL', value: 'FL' },
                { label: 'GA', value: 'GA' },
                { label: 'HI', value: 'HI' },
                { label: 'ID', value: 'ID' },
                { label: 'IL', value: 'IL' },
                { label: 'IN', value: 'IN' },
            ]
        }
        if (this.countryValue == 'CA') {
            this.statesDisabled = false;
            return [
                { label: 'ON', value: 'ON' },
                { label: 'QC', value: 'QC' },
                { label: 'NS', value: 'NS' },
                { label: 'NB', value: 'NB' },
                { label: 'MB', value: 'MB' },
                { label: 'BC', value: 'BC' },
                { label: 'PE', value: 'PE' },
                { label: 'SK', value: 'SK' },
                { label: 'AB', value: 'AB' },
                { label: 'NL', value: 'NL' }
            ]
        }
    }

    get paymentOptions() {
        return [
            { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
            { label: 'Cash/POS', value: 'Cash' },
        ];
    }
    get paymentOptionVisibility() {
        if (this.isCardSelected || this.isCashSelected) {
            return false;
        }
        return true;

    }

    resetPaymentSelection() {
        this.isCardSelected = false;
        this.isCashSelected = false;
    }
    get selectedPaymentOption() {
        if (this.isCashSelected) {
            this.paymentMode = 'Cash';
            return 'Cash/POS';
        } else {
            this.paymentMode = 'Card';
            return 'Credit/Debit Card';
        }
    }
    get isNoPaymentOptionSelected() {
        if (!this.isCashSelected && !this.isCardSelected) {
            return true;
        }
        return false;
    }
    handlePaymentSelection(event) {
        const selectedOption = event.detail.value;
        if (selectedOption == 'Credit/Debit Card') {
            this.isCardSelected = true;
            this.isCashSelected = false;
        }
        else {
            this.isCashSelected = true;
            this.isCardSelected = false;
        }


    }

    //Get data from server - in this example, it fetches from the event object
    @wire(fetchEvents)
    eventObj(value) {
        this.eventOriginalData = value; //To use in refresh cache

        const { data, error } = value;
        if (data) {

            //format as fullcalendar event object

            let slots = data.map(event => {
                return {
                    title: event.Capacity__c + ' slots available',
                    start: event.Start_Date__c,
                    end: event.End_Date__c
                };
            });
            this.slots = JSON.parse(JSON.stringify(slots));

            this.error = undefined;

            //load only on first wire call - 
            // if events are not rendered, try to remove this 'if' condition and add directly 
            if (!this.eventsRendered) {
                //Add events to calendar
                const ele = this.template.querySelector("div.fullcalendarjs");
                $(ele).fullCalendar('renderEvents', this.slots, true);
                this.eventsRendered = true;
            }
        } else if (error) {

            this.slots = [];
            this.error = 'No events are found';
        }
    }

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference) {
        Promise.all([
            this.servicesAtFacilityId = currentPageReference.state?.servicesAtFacilityId
        ])
            .then(() => {
                fetchServiceId({ serviceAtFacility: this.servicesAtFacilityId })
                    .then(data => {
                        this.facilityId = data;
                    })
                    .then(() => {
                        fetchServiceAtFacility({ serviceAtFacility: this.servicesAtFacilityId })
                            .then(data => {
                                if (data) {
                                    this.facilityAtServiceCapacity = data.Capacity__c;
                                    this.adultage = data.Adult_Age__c;
                                    this.childage = data.Child_Age__c;
                                    this.adultcost = data.Adult_Cost__c;
                                    this.childcost = data.Child_Cost__c;
                                    this.infantcost = data.Infant_Cost__c;
                                    if (data.Name == 'Campsite')
                                        this.isCampsite = true;
                                }
                            })
                            .catch((error) => {

                            })
                    })
                    .catch(error => {

                    })
            })
            .catch((error) => {

            });
    }

    /**
    * Load the fullcalendar.io in this lifecycle hook method
    */
    renderedCallback() {
        if (this.fullCalendarJsInitialised) {
            return;
        }
        this.fullCalendarJsInitialised = true;

        // Executes all loadScript and loadStyle promises
        // and only resolves them once all promises are done
        Promise.all([
            loadScript(this, FullCalendarJS + FULL_CALESNDAR_JQUERY),
            loadScript(this, FullCalendarJS + FULL_CALESNDAR_MOMENT),
            loadScript(this, FullCalendarJS + FULL_CALESNDAR_FullCalendar),
            loadStyle(this, FullCalendarJS + FULL_CALESNDAR_FullCalendar_CSS),
            loadScript(this, tilled + "/tilled/v1.js"),
            loadScript(this, paysafe + "/paysafe/paysafe.min.js"),
        ])
            .then(() => {
                this.initialiseFullCalendarJs();
            })
            .catch((error) => {
                console.error({
                    message: "Error occured on FullCalendarJS",
                    error,
                });
            });
    }

    initialiseFullCalendarJs() {
        const ele = this.template.querySelector("div.fullcalendarjs");
        const modal = this.template.querySelector('div.modalclass');

        var self = this;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var startRange = yyyy + '-' + mm + '-' + dd;
        var endRange = yyyy + 1 + '-' + mm + '-' + dd;

        this.blockedtimeslotsvar = []

        CalendarBookingMap({ serviceAtFacility: this.servicesAtFacilityId })
            .then(data => {
                this.availableslots = { ...data };
                let cusWaitingDays;


                fetchServiceAtFacility({ serviceAtFacility: this.servicesAtFacilityId })
                    .then(data => {
                        this.facilityAtServiceCapacity = data.Capacity__c;
                        console.log('this.facilityAtServiceCapacity572    ', JSON.stringify(this.facilityAtServiceCapacity));

                        //Added by pranit
                        getCustomMetadata()
                            .then(data => {
                                console.log('data connec:' + JSON.stringify(data))
                                cusWaitingDays = data;
                                console.log('cusWaitingDays 1 :' + cusWaitingDays)
                            })


                        //To open the form with predefined fields
                        //TODO: to be moved outside this function
                        function openActivityForm(startDate, endDate, activityType) {
                            self.startDate = startDate;
                            self.endDate = endDate;
                            self.openModal = true;
                            self.newVar = true;
                            self.activityType = activityType;
                        }

                        function openwaitingPopup(showWaitingPopup){
                            self.showPopup = showWaitingPopup;
                        }
                        //Actual fullcalendar renders here - https://fullcalendar.io/docs/v3/view-specific-options

                        $(ele).fullCalendar({
                            header: {
                                left: "prev,next today",
                                center: "title",
                                right: "month,agendaWeek,agendaDay",
                            },
                            //timezone: 'America/New_York',
                            defaultDate: new Date(),//.toLocaleString("en-US", {timeZone: "America/New_York"}), // default day is today - to show the current date
                            defaultView: 'month', //To display the default view - as of now it is set to week view
                            navLinks: true, // can click day/week names to navigate views
                            selectable: true, //To select the period of time
                            displayEventTime: false,

                            dayRender: function (date, cell) {

                                let DateConversion = new Date(date);

                                let CalendarDate = DateConversion.toISOString().split('T')[0];
                                /*code added for checking selected date and its available slot value.
                                Below code is also used to disable the clicking of cursor if slot value is equal to 0 */
                                console.log('TotalAvaialbleSlotsOnServiceFacilities630 = ' + TotalAvaialbleSlotsOnServiceFacilities + ' ' + CalendarDate);
                                console.log('Available slot is' + JSON.stringify(self.availableslots));
                                BookingDays = TotalAvaialbleSlotsOnServiceFacilities - (self.availableslots[CalendarDate] || 0);
                                BookingDays = BookingDays >= 0 ? BookingDays : 0;
                                let greenCheck = parseInt(((GreenPercentage / 100) * MaxCapacity), 10);
                                console.log('greencheck === ', greenCheck + ' ' + BookingDays + ' ' + MaxCapacity + ' ' + CalendarDate);
                                let status = BookingDays >= greenCheck ? "green" : BookingDays == 0 ? "red" : "orange";
                                if (BookingDays == 0) {
                                    console.log('inside if bookingdays');
                                    console.log('status === ' + JSON.stringify(status));

                                    $(cell).css('background-color', 'lightgray');
                                    $(cell).css('editor', 'false');

                                }
                                var d = new Date();
                                var CurrentDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + (d.getDate());
                                var CurrentDate1 = new Date(CurrentDate);
                                var PastDate = new Date(CalendarDate);
                                if (PastDate < CurrentDate1) {

                                    $(cell).css('background-color', 'lightgray');

                                }

                                //Added by Pranit 19-07-23 Start
                                let BookingDaysNew = TotalAvaialbleSlotsOnServiceFacilities - (self.availableslots[CalendarDate] || 0);
                                BookingDays = BookingDaysNew < 0 ? 'WL' + (BookingDaysNew * (-1)) : BookingDays;
                                //BookingDays = BookingDaysNew == 0 ? 'WL2': BookingDaysNew == -1 ? 'WL2' : BookingDays;
                                console.log('Final Available Booking Days::::', BookingDays);
                                //Added by Pranit 19-07-23 End 
                                
                                //Added by Pranit 20-07-23  
                                if (BookingDays === 'WL3' && this.maxDays > 0) {
                                    // Show a pop-up message if the waiting list is full (BookingDays === 'WL0')
                                    this.dispatchEvent(
                                        new ShowToastEvent({
                                            title: 'Info',
                                            message: 'Waiting limit reached Booking',
                                            variant: 'error',
                                        }),
                                    );
                                }
                                //Added by Pranit 20-07-23 End 



                                $(cell).css('position', 'relative');
                                if (PastDate >= CurrentDate1) {
                                    $(cell).append("<div style='height:50px;width:50px;border-radius:50%;background-color:" + status + ";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%); display:flex;justify-content:center;align-items:center'><span style = 'color: whitesmoke;font-weight: 900;font-size: 1.2em;'>" + BookingDays + "</span></div>")
                                }
                            },
                            eventAfterRender: function (event, element, view) {
                                if (view.name == 'agendaWeek' || view.name == 'agendaDay') {
                                    if (event.className == 'booked') {
                                        $(element).css({
                                        });
                                    }
                                } else {
                                    $(element).css('display', 'none');
                                }
                            },
                            allDay: false,
                            eventLimit: true, // allow "more" link when too many events
                            slots: this.slots, // all the events that are to be rendered - can be a duplicate statement here

                            eventLimitText: function () {
                                return " ";
                            },


                            //To select the time period : https://fullcalendar.io/docs/v3/select-method
                            select: function (startDate, endDate, allDay, jsEvent, view) {
                                console.log('start date is' + new Date(startDate));
                                console.log('new date is' + new Date());
                                let todayDate = new Date();
                                todayDate.setHours(0, 0, 0);
                                console.log('todayDate is :' + todayDate);
                                if (startDate < todayDate) {
                                    return false;
                                }
                                /* Below if condition is used to disable the clicking of cursor if slot value is equal to 0  */
                                /*if(BookingDays == 0){
                                    console.log('inside booking');
                                    return false;
                                    }*/
                                console.log('Start Date is' + startDate);
                                let DateConversion = new Date(startDate);
                                let CalendarDate = DateConversion.toISOString().split('T')[0];

                                //Added by Rupesh from here. Below code is used to update status of booking 


                                if (self.availableslots[CalendarDate] == undefined) {
                                    console.log('inside iff1   ' + self.availableslots[CalendarDate]);
                                    bookingstatus_calendar = TotalAvaialbleSlotsOnServiceFacilities;

                                }
                                else {

                                    bookingstatus_calendar = TotalAvaialbleSlotsOnServiceFacilities - self.availableslots[CalendarDate];
                                }
                                console.log('bookingstatus_calendar::' + bookingstatus_calendar);

                                // Added by Rupesh till above line
                                //Added by pranit 
                                let diferenceSlots = self.availableslots[CalendarDate] - TotalAvaialbleSlotsOnServiceFacilities;
                                //Added by pranit added AND condition
                                if (self.availableslots[CalendarDate] >= TotalAvaialbleSlotsOnServiceFacilities && diferenceSlots > 0 && diferenceSlots == cusWaitingDays) {
                                    console.log('toast msg'+diferenceSlots + ','+ cusWaitingDays );
                                    openwaitingPopup(true);
                                    return true;
                                }

                                let stDate = startDate.format();
                                let edDate = endDate.format();

                                self.startDateStore = stDate
                                self.endDateStore = edDate

                                if (stDate.includes('T')) {

                                } else {
                                    edDate = stDate
                                }

                                var beginningTime = '2050-11-01T06:00:00';
                                var endTime = '';
                                var endPreviousBlock = '';
                                var startPreviousBlock = '';
                                var blockTimesList = [];
                                var blockTimeObj = {};

                                openActivityForm(stDate, edDate, this.type);

                            },

                            eventClick: function (calEvent, jsEvent, view) {
                                $(this).css('border-color', 'red');
                            },
                        })
                    })
                    .catch(error => {
                        console.log('error --2 ' + JSON.stringify(error))
                    })

            })
            .catch((error) => {
                console.error({
                    message: "Error occured on CalendarMap",
                    error,
                });
            });
    }

    //To close the modal form
    handleCancel() {
        this.attendeeList = [];
        var newItem = [{ id: 0, emailclass: 'validateTwo hideemail', isRadioChecked: false, attendeefirstname: '', attendeelastname: '', attendeegender: '', attendeeage: '', attendeeemail: '', attendeephone: '',license: '' }];
        this.attendeeList = this.attendeeList.concat(newItem);
        this.summaryTableData = [];
        this.title = '';
        this.showCloseAndSummary = false;
        this.showClose = true;
        this.pathCurrentIndex = 0;
        this.cardnumberoutput = '';
        this.cardname = '';
        this.cardexpiration = '';
        this.country = '';
        this.cardcvv = '';
        this.state = '';
        this.zip = '';
        this.city = '';
        this.street = '';
        this.keyIndex = 0;

        let newevent;
        var ele = null;
        this.blockedtimeslotsvar = []
        let i = 0;

        ele = this.template.querySelector("div.fullcalendarjs")


        this.newVar = false;
        this.openModal = false;
        this.openAttendeesModal = false;
        this.summaryModal = false;
        this.paymentModal = false;
        this.receiptModal = false;
    }

    /**
    * @description: remove the event with id
    * @documentation: https://fullcalendar.io/docs/v3/removeEvents
    */

    removeEvent(event) {
        //open the spinner
        this.openSpinner = true;

        let eventid = event.target.value;
        deleteBooking({ 'eventid': eventid })
            .then(result => {
                const ele = this.template.querySelector("div.fullcalendarjs");
                $(ele).fullCalendar('removeEvents', [eventid]);
                this.openSpinner = false;
            }).then(result => {
                this.events = this.events.filter(function (element) {
                    return element.id != eventid;
                })
            })
            .catch(error => {
                console.log(error);
                this.openSpinner = false;
            });
    }

    /**
     * @description method to show toast events
     */

    showNotification(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    handleAttendees(event) {
        if (this.isInputValid()) {
            this.openModal = false;
            this.openAttendeesModal = true;
            this.summaryModal = false;
            this.paymentModal = false;
            this.receiptModal = false;
            this.openDisclaimer = false;

            this.template.querySelectorAll('.validate').forEach(ele => {
                if (ele.name === 'start') {
                    if (this.activityType.toLowerCase().includes('month')) {
                        this.startDate = ele.value;
                        let newStartDate = new Date(this.startDate)
                        if (this.startDate.includes('15') || this.startDate.includes('45')) {
                            newStartDate.setMinutes(newStartDate.getMinutes() - 15)
                        }
                        newStartDate = newStartDate.toUTCString()
                        console.log('newstartDate ' + newStartDate);
                        let mySubString = newStartDate.substring(newStartDate.indexOf(",") + 1, newStartDate.indexOf("GMT"))

                        let day = mySubString.substring(1, 3)
                        let month = mySubString.substring(newStartDate.indexOf(day) - 1, newStartDate.indexOf(day) + 2)
                        let year = mySubString.substring(newStartDate.indexOf(month), newStartDate.indexOf(month) + 4)
                        let hourandmin = mySubString.substring(newStartDate.indexOf(year) + 1, newStartDate.indexOf(":") - 1)
                        let hour = hourandmin.substring(0, hourandmin.indexOf(':'))
                        let min = hourandmin.substring(hourandmin.indexOf(':') + 1, hourandmin.length)

                        let monthObj = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
                        for (let index in monthObj) {
                            if (index.toLowerCase().includes(month.toLowerCase()) || month.toLowerCase().includes(index.toLowerCase())) {
                                month = monthObj[index];
                            }
                        }

                        let newDate = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':00.000Z'
                        this.startDate = newDate;

                        this.startDateStore = this.startDate;
                        if (this.startDateStore.toLowerCase().includes('z')) {
                            this.startDateStore = this.startDateStore.substring(0, this.startDateStore.indexOf('.'));
                        }
                    } else if (this.activityType.toLowerCase().includes('week') || this.activityType.toLowerCase().includes('day')) {
                        this.startDate = ele.value;
                        this.startDateStore = ele.value;
                        if (this.startDateStore.toLowerCase().includes('z')) {
                            this.startDateStore = this.startDateStore.substring(0, this.startDateStore.indexOf('.'));
                        }
                    }
                }
                if (ele.name === 'end') {
                    if (this.activityType.toLowerCase().includes('month')) {
                        this.endDate = ele.value;
                        let newEndDate = new Date(this.endDate)
                        if (this.endDate.includes('15') || this.endDate.includes('45')) {
                            newEndDate.setMinutes(newEndDate.getMinutes() + 15)
                        }
                        newEndDate = newEndDate.toUTCString()
                        let mySubString = newEndDate.substring(newEndDate.indexOf(",") + 1, newEndDate.indexOf("GMT"))

                        let day = mySubString.substring(1, 3)
                        let month = mySubString.substring(newEndDate.indexOf(day) - 1, newEndDate.indexOf(day) + 2)
                        let year = mySubString.substring(newEndDate.indexOf(month), newEndDate.indexOf(month) + 4)
                        let hourandmin = mySubString.substring(newEndDate.indexOf(year) + 1, newEndDate.indexOf(":") - 1)
                        let hour = hourandmin.substring(0, hourandmin.indexOf(':'))
                        let min = hourandmin.substring(hourandmin.indexOf(':') + 1, hourandmin.length)

                        let monthObj = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
                        for (let index in monthObj) {
                            if (index.toLowerCase().includes(month.toLowerCase()) || month.toLowerCase().includes(index.toLowerCase())) {
                                month = monthObj[index];
                            }
                        }

                        let newDate = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':00.000Z'
                        this.endDate = newDate

                        this.endDateStore = this.endDate;
                        if (this.endDateStore.toLowerCase().includes('z')) {
                            this.endDateStore = this.endDateStore.substring(0, this.endDateStore.indexOf('.'));
                        }
                    } else if (this.activityType.toLowerCase().includes('week') || this.activityType.toLowerCase().includes('day')) {
                        this.endDate = ele.value;
                        this.endDateStore = ele.value;
                        if (this.endDateStore.toLowerCase().includes('z')) {
                            this.endDateStore = this.endDateStore.substring(0, this.endDateStore.indexOf('.'));
                        }
                    }
                }
            })
            if (event.currentTarget.classList[1] != 'attendees' && event.currentTarget.classList[1] != 'payment') {
                this.pathTitleColor(1)
                this.pathFunction(event);
            }
        }
    }

    handleBack(event) {
        var layoutsRowValues = this.template.querySelectorAll('.validateTwo');
        var incrementRow = 0;

        for (var rowField of layoutsRowValues) {
            if (rowField.name == 'FirstName') {
                this.attendeeList[incrementRow].attendeefirstname = rowField.value;
            }
            if (rowField.name == 'LastName') {
                this.attendeeList[incrementRow].attendeelastname = rowField.value;
            }
            if (rowField.name == 'vlocity_ins__Gender__c') {
                this.attendeeList[incrementRow].attendeegender = rowField.value;
            }
            if (rowField.name == 'vlocity_ins__Age__c') {
                this.attendeeList[incrementRow].attendeeage = rowField.value;
            }
            if (rowField.name == 'Email') {
                this.attendeeList[incrementRow].attendeeemail = rowField.value;
            }
            if (rowField.name == 'Phone') {
                this.attendeeList[incrementRow].attendeephone = rowField.value;
                ++incrementRow;
            }
            if (rowField.name == 'License_Plate_Number') {
                this.attendeeList[incrementRow].license = rowField.value;
                ++incrementRow;
            }

        }

        var radioButtons = this.template.querySelectorAll('.radio');
        for (var radioButtonIndex = 0; radioButtonIndex < radioButtons.length; radioButtonIndex++) {
            if (this.radioId.split('-')[0] == radioButtons[radioButtonIndex].id.split('-')[0] && radioButtons[radioButtonIndex].checked) {
                this.attendeeList[radioButtonIndex].isRadioChecked = true;
            } else {
                this.attendeeList[radioButtonIndex].isRadioChecked = false;
            }
        }
        this.openModal = true;
        this.openAttendeesModal = false;

        this.pathTitleColor(0);

        this.pathFunction(event);
    }

    handleSummaryBack(event) {
        this.openDisclaimer = true;
        this.summaryModal = false;

        this.pathTitleColor(2);

        this.pathFunction(event);
    }
    handleDisclaimerBack(event) {
        this.openDisclaimer = false;
        this.openAttendeesModal = true;

        this.pathTitleColor(1);

        this.pathFunction(event);
    }

    handleSummary(event) {
        if (this.signatureData == 'no data' || this.signatureData == undefined || this.signatureData == null) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'No Signature Found',
                    variant: 'error'
                })
            );
            return;
        }
        if (this.template.querySelector('c-signature-canvas')?.isCanvasEmpty()) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'No Signature Found',
                    variant: 'error',
                })
            );
            return;
        }
        if (this.template.querySelector('c-signature-canvas')?.isSignSavedEmpty()) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'No Signature Found, Please save the signature in order to proceed ahead',
                    variant: 'error',
                })
            );
            return;
        }
        if (event.currentTarget.classList[1] != 'summary' && event.currentTarget.classList[1] != 'payment' && this.disclaimerChecked != false && this.disclaimerReservation != false) {
            this.openModal = false;
            this.openAttendeesModal = false;
            this.summaryModal = true;
            this.paymentModal = false;
            this.receiptModal = false;
            this.openDisclaimer = false;
            this.pathTitleColor(3)
            this.pathFunction(event);
        }
        else {
            this.showNotification('', 'You need to agree to the terms and conditions to proceed.', 'warning', 'dismissable')
        }
        var currdate = new Date().toISOString().substring(0, 10);
        this.signaturedate = currdate;
    }

    handleDisclaimer(event) {
        var isRadioCheckedClass;
        var isRadioCheckedBoolean;
        let totalCost = 0;
        let rowCount = 0;
        let loopCount = 0;
        var contactfirstname;
        var contactLicense;
        var contactlastname;
        var contactgender;
        var contacteage;
        var contactemail;
        var contactphone;


        if (this.isInputAttendeeValid(event)) {
            this.eventCost = 0;

            this.summaryTableData = [];

            var validateTwoList = this.template.querySelectorAll('.validateTwo');
            this.template.querySelectorAll('lightning-icon[title="Add Row"]').forEach(row => {
                for (let i = loopCount; i < validateTwoList.length; i++) {
                    loopCount++;
                    if (validateTwoList[i].name == 'FirstName') {
                        this.attendeeList[rowCount].attendeefirstname = validateTwoList[i].value;
                        contactfirstname = validateTwoList[i].value;

                    }
                    if (validateTwoList[i].name == 'LastName') {
                        this.attendeeList[rowCount].attendeelastname = validateTwoList[i].value;
                        contactlastname = validateTwoList[i].value;

                    }
                    if (validateTwoList[i].name == 'vlocity_ins__Gender__c') {
                        this.attendeeList[rowCount].attendeegender = validateTwoList[i].value;
                        contactgender = validateTwoList[i].value;

                    }
                    if (validateTwoList[i].name == 'vlocity_ins__Age__c') {
                        this.attendeeList[rowCount].attendeeage = validateTwoList[i].value;
                        contacteage = validateTwoList[i].value;

                    }
                    if (validateTwoList[i].name == 'Email') {
                        this.attendeeList[rowCount].attendeeemail = validateTwoList[i].value;
                        contactemail = validateTwoList[i].value;

                    }
                    if (validateTwoList[i].name == 'Phone') {
                        this.attendeeList[rowCount].attendeephone = validateTwoList[i].value;
                        contactphone = validateTwoList[i].value;

                        
                    }
                    if (validateTwoList[i].name == 'License_Plate_Number') {
                        this.attendeeList[rowCount].license = validateTwoList[i].value;
                        contactLicense = validateTwoList[i].value;
                        break;
                    }
                }
                let dynamicIconVar;
                if (row.accessKey == this.radioId.split('-')[0]) {
                    isRadioCheckedClass = 'validateTwo showemail fontControl';
                    isRadioCheckedBoolean = true;
                    dynamicIconVar = 'standard:task2';
                } else {
                    isRadioCheckedClass = 'validateTwo hideemail';
                    isRadioCheckedBoolean = false;
                    dynamicIconVar = '';
                }
                this.attendeeList[rowCount].emailclass = isRadioCheckedClass;
                this.attendeeList[rowCount].isRadioChecked = isRadioCheckedBoolean;

                let costVar;
                if (this.attendeeList[rowCount].attendeeage >= this.adultage) {
                    costVar = this.adultcost
                    totalCost = this.eventCost + costVar
                } else if (this.attendeeList[rowCount].attendeeage < this.adultage && this.attendeeList[rowCount].attendeeage > this.childage) {
                    costVar = this.childcost
                    totalCost = this.eventCost + costVar
                } else {
                    costVar = 'Free'
                    totalCost = this.eventCost + this.infantcost
                }
                this.eventCost = totalCost;

                this.summaryTableData.push({ attendeefirstname: contactfirstname.toUpperCase(), attendeelastname: contactlastname.toUpperCase(), attendeegender: contactgender, attendeeage: contacteage, attendeeemail: contactemail, attendeephone: contactphone, isRadioChecked: isRadioCheckedBoolean, costField: costVar, dynamicIcon: dynamicIconVar });

                rowCount++;
            });
            this.discountamount = 0;
            getCurrentMember()
                .then(data => {
                    this.memberpackage = data.Membership_Package__c;
                    console.log('Member package is' + this.memberpackage);
                    console.log('Member package data is' + data);
                    let discount = this.memberpackage == 'Silver' ? 20 : this.memberpackage == 'Gold' ? 30 : this.memberpackage == 'Platinum' ? 40 : 0;
                    console.log('Total cost is' + totalCost);
                    console.log('Discount is' + discount);
                    this.discountamount = (discount / 100) * this.eventCost;
                    console.log('discount amount is' + this.discountamount);

                    this.discountamount = (this.discountamount) ? this.discountamount : 0;

                    let totalCostwithDiscount = this.eventCost - this.discountamount;
                    this.taxes = (totalCostwithDiscount * 15) / 100;
                    this.eventAndTaxesCost = (totalCostwithDiscount + this.taxes);
                    console.log('Total cost with tax is' + this.eventAndTaxesCost);

                }).catch((error) => {

                });
            this.summaryTableData.sort((a, b) => {
                return b.isRadioChecked - a.isRadioChecked;
            });
            if (event.currentTarget.classList[1] != 'summary' && event.currentTarget.classList[1] != 'disclaimer') {
                this.openModal = false;
                this.openAttendeesModal = false;
                this.summaryModal = false;
                this.paymentModal = false;
                this.receiptModal = false;
                this.openDisclaimer = true;
                this.pathTitleColor(2)
                this.pathFunction(event);
            }
        }

    }

    handlePayment(event) {

        this.openModal = false;
        this.openAttendeesModal = false;
        this.summaryModal = false;
        this.paymentModal = true;
        this.receiptModal = false;
        if (event.currentTarget.classList[1] != 'payment') {
            this.pathTitleColor(4)
            this.pathFunction(event);
        }
        fetchClientSecret({ paymentAmount: this.eventAndTaxesCost, allAttendees: JSON.stringify(this.attendeeList) })
            .then((result) => {
                this.accountId = result.paymentInfo.AccountId__c;
                this.publishKey = result.paymentInfo.Publish_Key__c;
                this.client_secret = result.client_secret;
                this.ContactId = result.parentId;
            })
            .catch((error) => {

            });

    }

    handlePaymentBack(event) {
        this.summaryModal = true;
        this.paymentModal = false;
        this.resetPaymentSelection();
        this.pathTitleColor(2);
        this.pathFunction(event);
    }

    addRow() {
        console.log('Splitted start Date is: ' + this.splitstartDate)
        console.log('Available slots for selected Date: ' + this.availableslots[this.splitstartDate])
        if (this.attendeeList.length < (15 - (this.availableslots[this.splitstartDate] || 0))) {
            this.fileData = false;

            ++this.keyIndex;
            var newItem = [{ id: this.keyIndex, emailclass: 'validateTwo hideemail', isRadioChecked: false, attendeefirstname: '', attendeelastname: '', attendeegender: '', attendeeage: '', attendeeemail: '', attendeephone: '',license:'' }];
            this.attendeeList = this.attendeeList.concat(newItem);
            this.summaryTableData = this.summaryTableData.concat({ id: this.keyIndex, isRadioChecked: false, attendeefirstname: '', attendeelastname: '', attendeegender: '', attendeeage: '', attendeeemail: '', attendeephone: '' });

            this.classes;

        }
        else {
            this.dispatchEvent(

                new ShowToastEvent({
                    title: this.errorMessage,
                    message: '',
                    variant: 'error',
                }),

            );
        }
    }

    removeRow(event) {
        var i = 1;
        var idCount = 0;
        var rowObject = {};

        if (this.attendeeList.length > 1) {
            this.template.querySelectorAll('.validateTwo').forEach(rowItem => {
                if (rowItem.name == 'FirstName') {
                    rowObject.attendeefirstname = rowItem.value;
                }
                if (rowItem.name == 'LastName') {
                    rowObject.attendeelastname = rowItem.value;
                }
                if (rowItem.name == 'vlocity_ins__Gender__c') {
                    rowObject.attendeegender = rowItem.value;
                }
                if (rowItem.name == 'vlocity_ins__Age__c') {
                    rowObject.attendeeage = rowItem.value;
                }
                if (rowItem.name == 'Email') {
                    rowObject.attendeeemail = rowItem.value;
                }
                if (rowItem.name == 'Phone') {
                    rowObject.attendeephone = rowItem.value;
                }
                if (rowItem.name == 'License_Plate_Number') {
                    rowObject.license = rowItem.value;
                }
                if (i % 6 == 0) {
                    if (this.attendeeList[idCount].isRadioChecked == true) {
                        if (this.radioId.split('-')[0] == event.target.accessKey) {
                            this.radioId = '';
                            this.attendeeList[idCount].emailclass = 'validateTwo hideemail';
                            this.attendeeList[idCount].isRadioChecked = false;
                            rowObject.isRadioChecked = false;
                            this.showCloseAndSummary = false;
                            this.showClose = true;
                        } else {
                            if (this.attendeeList[idCount].emailclass = 'validateTwo hideemail') {
                                this.attendeeList[idCount].emailclass = 'validateTwo showemail fontControl';
                            }
                            rowObject.isRadioChecked = true;
                        }
                    } else {
                        rowObject.isRadioChecked = false;
                    }

                    if (rowObject.attendeeage > this.adultage) {
                        rowObject.costField = this.adultcost
                    } else if (rowObject.attendeeage < this.adultage && rowObject.attendeeage > this.childage) {
                        rowObject.costField = this.childcost
                    } else {
                        rowObject.costField = this.infantcost
                    }

                    if (this.summaryTableData[idCount].id != event.target.accessKey) {
                        this.summaryTableData[idCount].attendeefirstname = rowObject.attendeefirstname.toUpperCase();
                        this.summaryTableData[idCount].attendeelastname = rowObject.attendeelastname.toUpperCase();
                        this.summaryTableData[idCount].attendeegender = rowObject.attendeegender;
                        this.summaryTableData[idCount].attendeeage = rowObject.attendeeage;
                        this.summaryTableData[idCount].attendeeemail = rowObject.attendeeemail;
                        this.summaryTableData[idCount].attendeephone = rowObject.attendeephone;


                        this.summaryTableData[idCount].isRadioChecked = rowObject.isRadioChecked;
                        this.summaryTableData[idCount].costField = rowObject.costField;

                        this.attendeeList[idCount].attendeefirstname = rowObject.attendeefirstname;
                        this.attendeeList[idCount].attendeelastname = rowObject.attendeelastname;
                        this.attendeeList[idCount].attendeegender = rowObject.attendeegender;
                        this.attendeeList[idCount].attendeeage = rowObject.attendeeage;
                        this.attendeeList[idCount].attendeeemail = rowObject.attendeeemail;
                        this.attendeeList[idCount].attendeephone = rowObject.attendeephone;


                        this.attendeeList[idCount].isRadioChecked = rowObject.isRadioChecked;
                        if (this.attendeeList[idCount].isRadioChecked == false) {
                            this.attendeeList[idCount].emailclass = 'validateTwo hideemail';
                        } else {
                            this.attendeeList[idCount].emailclass = 'validateTwo showemail fontControl';
                        }
                    }
                    idCount++;
                }
                i++;
            })
            this.attendeeList = this.attendeeList.filter(function (element) {
                return parseInt(element.id) !== parseInt(event.target.accessKey);
            });
        } else {
            this.keyIndex = 0;
            this.showCloseAndSummary = false;
            this.showClose = true;

            Promise.all([
                this.attendeeList = []
            ])
                .then(() => {
                    this.radioId = '';
                    var newItem = [{ id: 0, emailclass: 'validateTwo hideemail', isRadioChecked: false, attendeefirstname: '', attendeelastname: '', attendeegender: '', attendeeage: '', attendeeemail: '', attendeephone: '', license:''}];
                    this.attendeeList = this.attendeeList.concat(newItem);
                    this.summaryTableData = [{ id: 0, isRadioChecked: false, attendeefirstname: '', attendeelastname: '', attendeegender: '', attendeeage: '', attendeeemail: '', attendeephone: '' }];
                })
                .catch((error) => {
                    console.error({
                        message: "Error occured on FullCalendarJS",
                        error,
                    })
                })
        }
        this.summaryTableData = this.summaryTableData.filter(function (element) {
            return parseInt(element.id) !== parseInt(event.target.accessKey);
        });

        this.classes;
    }

    handleRadio(event) {
        this.showCloseAndSummary = true;
        this.showClose = false;

        var radioButtons = this.template.querySelectorAll('.radio');
        for (var radioButton of radioButtons) {
            if (event.target.id != radioButton.id) {
                radioButton.checked = false;

            } else {
                this.radioId = radioButton.id;
                this.GetDetailsofUser(true);


            }
        }

        for (var primarycheckIndex = 0; primarycheckIndex < radioButtons.length; primarycheckIndex++) {
            if (this.attendeeList[primarycheckIndex].id == this.radioId.split('-')[0]) {
                this.attendeeList[primarycheckIndex].emailclass = 'validateTwo showemail fontControl';
                this.attendeeList[primarycheckIndex].isRadioChecked = true;
                //autopopulate only when primary button is clicked
                this.attendeeList[primarycheckIndex].attendeefirstname = this.attendeefirstname;
                this.attendeeList[primarycheckIndex].attendeelastname = this.attendeelastname;
                this.attendeeList[primarycheckIndex].attendeeemail = this.attendeeemail;
                this.attendeeList[primarycheckIndex].attendeephone = this.attendeephone;
                this.attendeeList[primarycheckIndex].attendeegender = this.attendeegender;
                this.attendeeList[primarycheckIndex].attendeeage = this.attendeeage;

                this.attendeeList[primarycheckIndex].license = this.license;


            } else {
                this.attendeeList[primarycheckIndex].attendeeemail = null;
                this.attendeeList[primarycheckIndex].attendeephone = null;
                this.attendeeList[primarycheckIndex].license = null;

                this.attendeeList[primarycheckIndex].emailclass = 'validateTwo hideemail';
                // this.attendeeList[primarycheckIndex].isRadioChecked = false;

                //if primary button is not selected then return null value
                if (this.attendeeList[primarycheckIndex].isRadioChecked) {
                    this.attendeeList[primarycheckIndex].attendeefirstname = '';
                    this.attendeeList[primarycheckIndex].attendeelastname = '';
                    this.attendeeList[primarycheckIndex].attendeeemail = '';
                    this.attendeeList[primarycheckIndex].attendeephone = '';
                    this.attendeeList[primarycheckIndex].attendeegender = '';
                    this.attendeeList[primarycheckIndex].attendeeage = '';

                    this.attendeeList[primarycheckIndex].license = '';


                }
                this.attendeeList[primarycheckIndex].isRadioChecked = false;
            }
        }

    }

    countryChange(event) {
        this.countryValue = event.target.value;
    }

    expirationChanged(event) {
        let expirationNumber = this.template.querySelector('.expirationnumber');
        if (event.target.value.length == 4) {
            expirationNumber.blur();
        }
    }

    expirationCommitted(event) {
        this.cardexpiration = '';
        let expirationValue = event.target.value;
        if (!expirationValue.includes('/') && expirationValue.length == 4) {
            for (let i = 0; i < expirationValue.length; i++) {
                if (i == 1) {
                    this.cardexpiration += expirationValue[i] + '/';
                } else {
                    this.cardexpiration += '' + expirationValue[i];
                }
            }
        }
        this.template.querySelector('.expirationnumber').style.color = "green";
        this.template.querySelector('.cvv').focus();
    }

    cardnumberChanged(event) {
        if (event.target.value.length >= 16) {
            let cardNumberField = this.template.querySelector('.cardnumber');
            cardNumberField.blur();
        }
    }

    cardnumberCommitted(event) {
        this.cardNumber = event.target.value;
        let cardnumbervalue = event.target.value;
        this.cardnumberoutput = '';
        let counter = 0;
        for (let i = 0; i < cardnumbervalue.length; i++) {
            counter++;
            this.cardnumberoutput += '' + cardnumbervalue[i];
            if (counter % 4 == 0) {
                this.cardnumberoutput += ' ';
            }
        }
        this.template.querySelector('.cardnumber').style.color = "green";
        this.template.querySelector('.expirationnumber').focus();
    }

    cvvChanged(event) {
        if (event.target.value.length == 3) {
            this.cardcvv = event.target.value;
            this.template.querySelector('.cvv').style.color = "green";
            this.template.querySelector('.cardHolderName').focus();
        }
    }

    nameBlur(event) {
        this.cardname = event.target.value;
        this.template.querySelector('.cardHolderName').style.color = "green";
    }

    countryBlur(event) {
        this.country = event.target.value;
        this.template.querySelector('.country').style.color = "green";
        this.template.querySelector('.states').focus();
    }

    statesBlur(event) {
        this.state = event.target.value;
        this.template.querySelector('.states').style.color = "green";
    }

    zipBlur(event) {
        this.zip = event.target.value;
        this.template.querySelector('.zip').style.color = "green";
    }

    cityBlur(event) {
        this.city = event.target.value;
        this.template.querySelector('.cities').style.color = "green";
    }

    streetBlur(event) {
        this.street = event.target.value;
        this.template.querySelector('.streets').style.color = "green";
        this.template.querySelector('.payButton').focus();
    }

    pathFunction(event) {
        var pathElements = this.template.querySelectorAll('.slds-path__item');
        for (var i = this.pathCurrentIndex; i < pathElements.length; i++) {
            if (i < pathElements.length - 1 && event.target != undefined) {
                if (event.target.name == 'Add Attendees' || event.target.name == 'Summary' || event.target.name == "Proceed Payment" || event.target.name == "Pay" || event.target.name == 'Disclaimer' || event.target.name == 'Receipt') {
                    pathElements[i].classList.remove('slds-is-active');
                    pathElements[i].classList.remove('slds-is-current');
                    pathElements[i].classList.add('slds-is-complete');

                    //  Make the next one current and active 
                    pathElements[i + 1].classList.add('slds-is-active');
                    pathElements[i + 1].classList.add('slds-is-current');
                    pathElements[i + 1].classList.remove('slds-is-incomplete');

                    this.pathCurrentIndex += 1;
                } else if (event.target.name == "Back") {

                    pathElements[i].classList.remove('slds-is-active');
                    pathElements[i].classList.remove('slds-is-current');
                    pathElements[i].classList.remove('slds-is-complete');
                    pathElements[i].classList.add('slds-is-incomplete');

                    //  Make the previous one current and active 
                    pathElements[i - 1].classList.add('slds-is-active');
                    pathElements[i - 1].classList.add('slds-is-current');
                    pathElements[i - 1].classList.remove('slds-is-incomplete');

                    this.pathCurrentIndex -= 1;
                }
                break;
            }
        }
    }

    handleTransactionPayment(event) {

        if (this.isCardInfoValid()) {
            var eventName = { 'target': { 'name': event.target.name } };
            var account_id = this.accountId;
            var pk_PUBLISHABLE_KEY = this.publishKey;
            var payment_intent_client_secret = this.client_secret;
            var paymentSucceeded = false;
            const tilledAccountId = account_id


            const fieldOptions = {
                styles: {
                    base: {
                        fontFamily: 'Helvetica Neue, Arial, sans-serif',
                        color: '#304166',
                        fontWeight: '400',
                        fontSize: '16px',
                    },
                    invalid: {
                        ':hover': {
                            textDecoration: 'underline dotted red',
                        },
                    },
                    valid: {
                        color: '#00BDA5',
                    },
                },
            };



            var nameValue = this.cardname;
            var countryValue = this.country;
            var zipValue = this.zip;
            var cityValue = this.city;
            var stateValue = this.state;
            var streetValue = this.street;

            this.openModal = false;
            this.openAttendeesModal = false;
            this.summaryModal = false;
            this.paymentModal = false;
            this.receiptModal = true;

            fetchUserInfo()
                .then(data => {
                    if (data) {
                        if (this.activityType == 'month') {
                            this.startDate = (new Date(new Date(this.startDate) - ((new Date()).getTimezoneOffset() * 60000))).toISOString();
                            this.endDate = (new Date(new Date(this.endDate) - ((new Date()).getTimezoneOffset() * 60000))).toISOString();
                        } else if (this.activityType != 'month') {
                        }
                        this.eventDetails = {endtime:this.endTime, startdate: this.startDate, enddate: this.endDate, starttime : this.startTime, activitytype: this.activityType, recreationalid: this.facilityId };
                        console.log('@#@# JSON.stringify(this.eventDetails)->'+JSON.stringify(this.eventDetails))
                        this.paymentDetails = { paymentmode: this.paymentMode, totalamount: this.eventAndTaxesCost, country: this.country, street: this.street, zipcode: this.zip, city: this.city, state: this.state };
                        createPaymentTransaction({ paymentResponseJSON1: JSON.stringify(this.paymentDetails) })
                            .then((result) => {

                                this.paymentTransaction = result;
                                // this.pdfUrl = 'https://csa-lpi-2021--parks--c.sandbox.vf.force.com/apex/BookingReceipt?Id=' + this.paymentTransaction.Id;
                                var completeSiteUrl = (window.location.href).substr(0, (window.location.href).indexOf('/s'));
                                this.pdfUrl = completeSiteUrl + '/apex/Booking_Receipt_Ack?Id=' + this.paymentTransaction.Id + '&' + 'SendParam=' + 10;

                                console.log('bookingdays at 1521 == ' + BookingDays);
                                console.log(JSON.stringify(this.attendeeList));

                                successfullTransaction({ paymentResponseJSON1: JSON.stringify(this.paymentDetails),allAttendees: JSON.stringify(this.attendeeList), bookingDetails: JSON.stringify(this.eventDetails), bookingstatus_calendar: bookingstatus_calendar, serviceAtFacilityId: this.servicesAtFacilityId, paymentTransaction: this.paymentTransaction })
                                    .then((result) => {

                                        lastBlockedTimeSlot()
                                            .then((result) => {
                                                this.bookingReference = result.Name
                                                this.bookingReferenceId = result.Id
                                                
                                                updateSignature({ signElement: this.signatureData, bookingId: result.Id })
                                                    .then((documentSignResult) => {
                                                        this.paymentDone = true;
                                                    }).catch(error => { console.log("error in updateSignature -- ", error) });
                                                // Update signature code Ends

                                                sendEmail({ bookingRef: this.bookingReference, allAttendees: JSON.stringify(this.attendeeList), paymentTransaction: this.paymentTransaction })
                                                    .then((result) => {
                                                        console.log('email sent successfully')
                                                        const { base64, filename } = this.fileData
                                                        uploadFile({ base64, filename, 'recordId': this.ContactId }).then(result => {
                                                            this.fileData = null
                                                            let title = `${filename} uploaded successfully!!`
                                                            this.toast(title)
                                                        }).catch((error) => {
                                                            console.log('error in upload file')
                                                        })

                                                    }).catch((error) => {
                                                        console.log('failed to send email')
                                                    })
                                            }).catch((error) => {
                                                console.log('couldnt return lastBlockedTimeSlot ' + error)
                                            })
                                    })


                                    .catch((error) => {
                                        console.log('JS successfullTransaction ERROR' + JSON.stringify(error));
                                    });
                            })
                            .catch((error) => {
                                console.log('JS createPaymentTransaction ERROR' + JSON.stringify(error));
                            });

                        console.log(event.currentTarget.classList);
                        if (event.currentTarget.classList[1] != 'receipt') {
                            if (data.UserType.toLowerCase().includes('guest') || data.Name.toLowerCase().includes('guest')) {
                                this.isGuestUser = true;
                            }
                            //Comments: Changes by Pranit on 19th Apr 2023
                            //this.pathFunction(event); Changes by Pranit on 19th Apr 2023
                            this.pathTitleColor(5);
                            this.pathFunction(eventName); //Changes by Pranit on 19th Apr 2023
                        }
                    }
                }).catch(error => {
                    //this.pathFunction(event); Changes by Pranit on 19th Apr 2023
                    this.pathTitleColor(5);
                    this.pathFunction(eventName); //Changes by Pranit on 19th Apr 2023

                })
        }

    }

    /*
    *   This method is used to check if all the input fields 
    *   of the event modal are valid or not.
    */
    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validate');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    /*
    *   This method is used to check if all the input fields 
    *   of the attendee modal are validate or not.
    */
    isInputAttendeeValid(event) {
        if (event.currentTarget.classList[1] == 'summary' || event.currentTarget.classList[1] == 'payment') {
            this.openAttendeesModal = true;
        }
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validateTwo');
        if (inputFields.length == 0) {
            this.openAttendeesModal = false;
            isValid = false;
        }
        inputFields.forEach(inputField => {

            if ((!inputField.checkValidity() && inputField.name != 'Email' && inputField.name != 'Phone' && inputField.name != 'License_Plate_Number') || (!inputField.checkValidity() && (inputField.name == 'Email' || inputField.name == 'Phone' || inputField.name == 'License_Plate_Number') && inputField.id.split('-')[0] == this.radioId.split('-')[0])) {
                isValid = false;
                inputField.reportValidity();
            }
        });
        var radioButtons = this.template.querySelectorAll('.radio');
        let radioButtonCheckList = [];
        for (var radioButtonIndex = 0; radioButtonIndex < radioButtons.length; radioButtonIndex++) {
            radioButtonCheckList.push(radioButtons[radioButtonIndex].checked);
        }
        if (!radioButtonCheckList.includes(true)) {
            isValid = false;
        }
        return isValid;
    }

    /*
    *   This method is used to check if all the card holder input fields 
    *   of the event modal are valid or not.
    */
    isCardInfoValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validateCardInfo');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    pathClickHandler(event) {
        event.preventDefault()
        let pathName = event.currentTarget.classList[1];
        if (pathName == 'newEvent') {
            if (this.pathCurrentIndex == 5) {
                return;
            }
            this.openModal = true;
            this.openAttendeesModal = false;
            this.summaryModal = false;
            this.paymentModal = false;
            this.receiptModal = false;
            this.pathCurrentIndex = 0;

            this.pathElementClasses(0);
        }
        if (pathName == 'attendees') {
            this.checkPathValidity()
            if (this.checkPathValidityPassed == false) {
                return
            }
            if (this.isInputValid()) {
                this.handleAttendees(event);
                this.pathCurrentIndex = 1;
                this.pathElementClasses(1);
            }
        }
        if (pathName == 'disclaimer') {
            this.checkPathValidity()
            if (this.checkPathValidityPassed == false) {
                return
            }

            this.handleDisclaimer(event);

            let radioCheckList = [];
            for (let i = 0; i < this.attendeeList.length; i++) {
                radioCheckList.push(this.attendeeList[i].isRadioChecked)
            }

            let isAttendeesValid = true;
            if (!radioCheckList.includes(true)) {
                isAttendeesValid = false;
            }
            for (let i = 0; i < this.attendeeList.length; i++) {
                if (this.attendeeList[i].attendeefirstname == '' || this.attendeeList[i].attendeelastname == '' || this.attendeeList[i].attendeegender == '' || this.attendeeList[i].attendeeage == '' || (this.attendeeList[i].isRadioChecked && (this.attendeeList[i].attendeeemail == '' || this.attendeeList[i].attendeephone == '' || this.attendeeList[i].license == ''))) {
                    isAttendeesValid = false;
                }
            }

            if (this.isInputValid() && isAttendeesValid) {
                this.openModal = false;
                this.openAttendeesModal = false;
                this.summaryModal = false;
                this.paymentModal = false;
                this.receiptModal = false;
                this.openDisclaimer = true;
                this.pathCurrentIndex = 2;
                this.pathElementClasses(2);
            } else {
                return
            }
        }
        if (pathName == 'summary') {
            this.checkPathValidity()
            if (this.checkPathValidityPassed == false) {
                return
            }

            this.handleSummary(event);
            if (this.isInputValid() && this.disclaimerChecked != false && this.disclaimerReservation != false) {
                this.openModal = false;
                this.openAttendeesModal = false;
                this.summaryModal = true;
                this.paymentModal = false;
                this.receiptModal = false;
                this.openDisclaimer = false;
                this.pathCurrentIndex = 3;
                this.pathElementClasses(3);
            }
        }
        if (pathName == 'payment') {
            this.checkPathValidity()
            if (this.checkPathValidityPassed == false) {
                return
            }
            let radioCheckList = [];
            for (let i = 0; i < this.attendeeList.length; i++) {
                radioCheckList.push(this.attendeeList[i].isRadioChecked)
            }

            let isAttendeesValid = true;
            if (!radioCheckList.includes(true)) {
                isAttendeesValid = false;
            }
            for (let i = 0; i < this.attendeeList.length; i++) {
                if (this.attendeeList[i].attendeefirstname == '' || this.attendeeList[i].attendeelastname == '' || this.attendeeList[i].attendeegender == '' || this.attendeeList[i].attendeeage == '' || (this.attendeeList[i].isRadioChecked && (this.attendeeList[i].attendeeemail == '' || this.attendeeList[i].attendeephone == '' || this.attendeeList[i].license == ''))) {
                    isAttendeesValid = false;
                }
            }
            if (this.isInputValid() && isAttendeesValid && this.signature != undefined && this.signature != '') {
                this.openAttendeesModal = false;
                this.openDisclaimer = false;
                this.summaryModal = false;
                this.paymentModal = true;
                this.handlePayment(event);
                this.pathCurrentIndex = 4;
                this.pathElementClasses(4);
            }
        }
        if (pathName == 'receipt') {
            let isAttendeesValid = true;
            for (let i = 0; i < this.attendeeList.length; i++) {
                if (!this.summaryTableData[i].attendeefirstname || !this.summaryTableData[i].attendeelastname || !this.summaryTableData[i].attendeegender || !this.summaryTableData[i].attendeeage || (this.summaryTableData[i].isRadioChecked && (!this.summaryTableData[i].attendeeemail || !this.summaryTableData[i].attendeephone ))) {
                    isAttendeesValid = false;
                }
            }

            if (this.isInputValid() && isAttendeesValid && (this.cardnumberoutput && this.cardname && this.cardexpiration && this.country && this.cardcvv && this.state && this.zip && this.city && this.street)) {
                this.handleTransactionPayment(event);
                this.pathCurrentIndex = 5;
                this.pathElementClasses(5);
            }
        }
    }

    pathElementClasses(pathNumber) {
        var pathElements = this.template.querySelectorAll('.slds-path__item');
        var pathTitle = this.template.querySelectorAll('.slds-path__title');
        for (var i = 0; i < pathElements.length; i++) {
            if (i == pathNumber) {
                pathElements[i].classList.add('slds-is-active');
                pathElements[i].classList.add('slds-is-current');
                pathElements[i].classList.remove('slds-is-incomplete');
                pathTitle[i].classList.add('one');
            } else if (i > pathNumber) {
                pathElements[i].classList.remove('slds-is-active');
                pathElements[i].classList.remove('slds-is-current');
                pathElements[i].classList.remove('slds-is-complete');
                pathElements[i].classList.add('slds-is-incomplete');
                pathTitle[i].classList.remove('one');
            } else {
                pathElements[i].classList.remove('slds-is-active');
                pathElements[i].classList.remove('slds-is-current');
                pathElements[i].classList.add('slds-is-complete');
                pathElements[i].classList.remove('slds-is-incomplete');
                pathTitle[i].classList.remove('one');
            }
        }
    }

    pathTitleColor(pathNumber) {
        var pathTitle = this.template.querySelectorAll('.slds-path__title');
        console.log('pathTitle', pathTitle);
        for (var i = 0; i < 6; i++) {
            if (i == pathNumber) {
                pathTitle[i].classList.add('one');
            } else {
                pathTitle[i].classList.remove('one');
            }
        }
    }

    dateChange(event) {
        /*let startDate
        let endDate
        console.log('>>>>>>>>1' + event.target.name);
        if (event.target.name == 'start') {
            startDate = event.target.value;
            let newStartDate = new Date(startDate)
            if (startDate.includes('15') || startDate.includes('45')) {
                newStartDate.setMinutes(newStartDate.getMinutes() - 15)
            }
            newStartDate = newStartDate.toUTCString()
            let mySubString = newStartDate.substring(newStartDate.indexOf(",") + 1, newStartDate.indexOf("GMT"))

            let day = mySubString.substring(1, 3)
            let month = mySubString.substring(newStartDate.indexOf(day) - 1, newStartDate.indexOf(day) + 2)
            let year = mySubString.substring(newStartDate.indexOf(month), newStartDate.indexOf(month) + 4)
            let hourandmin = mySubString.substring(newStartDate.indexOf(year) + 1, newStartDate.indexOf(":") - 1)
            let hour = hourandmin.substring(0, hourandmin.indexOf(':'))
            let min = hourandmin.substring(hourandmin.indexOf(':') + 1, hourandmin.length)

            let monthObj = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
            for (let index in monthObj) {
                if (index.toLowerCase().includes(month.toLowerCase()) || month.toLowerCase().includes(index.toLowerCase())) {
                    month = monthObj[index];
                }
            }
            let newDate = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':00.000Z'
            startDate = newDate;
            let DateConversion = new Date(startDate);
            let CalendarDate = DateConversion.toISOString().split('T')[0];
            console.log('Calendar Date is: ' + CalendarDate)
            this.splitstartDate = CalendarDate;
            console.log('Split Start Date is: ' + this.splitstartDate)
            startDate = (new Date(new Date(startDate) - ((new Date()).getTimezoneOffset() * 60000))).toISOString();
            this.selectedStartDate = startDate

        }

        if (event.target.name == 'end') {
            endDate = event.target.value;
            let newEndDate = new Date(endDate)
            if (endDate.includes('15') || endDate.includes('45')) {
                newEndDate.setMinutes(newEndDate.getMinutes() - 15)
            }
            newEndDate = newEndDate.toUTCString()
            let mySubString = newEndDate.substring(newEndDate.indexOf(",") + 1, newEndDate.indexOf("GMT"))

            let day = mySubString.substring(1, 3)
            let month = mySubString.substring(newEndDate.indexOf(day) - 1, newEndDate.indexOf(day) + 2)
            let year = mySubString.substring(newEndDate.indexOf(month), newEndDate.indexOf(month) + 4)
            let hourandmin = mySubString.substring(newEndDate.indexOf(year) + 1, newEndDate.indexOf(":") - 1)
            let hour = hourandmin.substring(0, hourandmin.indexOf(':'))
            let min = hourandmin.substring(hourandmin.indexOf(':') + 1, hourandmin.length)

            let monthObj = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
            for (let index in monthObj) {
                if (index.toLowerCase().includes(month.toLowerCase()) || month.toLowerCase().includes(index.toLowerCase())) {
                    month = monthObj[index];
                }
            }
            let newDate = year + '-' + month + '-' + day + 'T' + hour + ':' + min + ':00.000Z'
            endDate = newDate;
            endDate = (new Date(new Date(endDate) - ((new Date()).getTimezoneOffset() * 60000))).toISOString();

            this.selectedEndDate = endDate
        } console.log('endDate' + endDate);
        if (event.target.name == 'signature-element') {
            this.signature = event.target.value;
        }
        if (event.target.name == 'disclaimer-element') {
            this.disclaimerChecked = event.target.checked;
        }
        if (event.target.name == 'disclaimer-reservation') {
            this.disclaimerReservation = event.target.checked;
        }
        console.log('selectedStartDate' + this.selectedStartDate);
        console.log('selectedEndDate' + this.selectedEndDate);
        if (this.selectedStartDate > this.selectedEndDate) {

            this.showNotification('', 'Start Date cannot be Greater than End Date', 'warning', 'dismissable')
            this.showCloseAndAddParticipants = false
            this.showCloseAtt = true
            return;
        }
        if ((startDate - endDate) * 24 * 60) {
            this.showNotification('', 'Start Date and end  Date Gap should be 24 hours', 'warning', 'dismissable')
            this.showCloseAndAddParticipants = false
            this.showCloseAtt = true
            return;
        }

        for (let index in this.blockedtimeslotsvar) {
            let newStartDate = new Date(this.blockedtimeslotsvar[index].start)
            if (this.blockedtimeslotsvar[index].start.includes('15') || this.blockedtimeslotsvar[index].start.includes('45')) {
                newStartDate.setMinutes(newStartDate.getMinutes() - 15)
            }

            let blockedStart = this.blockedtimeslotsvar[index].start
            console.log('blockedStart' + blockedStart);

            let blockedEnd = this.blockedtimeslotsvar[index].end
            console.log('blockedEnd' + blockedEnd);
            if (this.selectedStartDate == blockedStart || this.selectedEndDate == blockedEnd || (this.selectedStartDate >= blockedStart && this.selectedEndDate <= blockedEnd)) {
                this.showCloseAndAddParticipants = false
                this.showCloseAtt = true
                this.showNotification('', 'All Bookings are Full at this Time, Try another Choice', 'warning', 'dismissable')
                break;
            } else {
                this.showCloseAndAddParticipants = true
                this.showCloseAtt = false
            }
        }
        if (this.blockedtimeslotsvar.length == 0) {
            this.showCloseAndAddParticipants = true;
        }*/
        let startDate
        let endDate






        if (event.target.name == 'start') {
            debugger;

            startDate = event.target.value;
            console.log('Start Date: ' + this.startDate);
            console.log('Start times: ' + JSON.stringify(event.target.value));

            this.selectedStartDate = startDate
        }
        if (event.target.name == 'starttime') {
            this.startTime = event.target.value;
            console.log('Start Time: ' + this.startTime);
            /*const endHour = parseInt(this.startTime) + 1;
            this.endOptions = this.startOptions
                .filter(option => parseInt(option.value) >= endHour)
                .map(option => ({ label: option.label, value: option.value }));
            this.endTime = this.endOptions[0].value;
            console.log('End Time: ' + this.endTime);*/
        }
        



        if (event.target.name == 'end') {
            endDate = event.target.value;
            console.log('End Date: ' + this.endDate);


            this.selectedEndDate = endDate
        }

        if (event.target.name == 'endtime') {
            this.endTime = event.target.value;
            console.log('end Time: ' + this.endTime);
        }

        if (event.target.name == 'signature-element') {
            this.signature = event.target.value;
        }
        if (event.target.name == 'disclaimer-element') {
            this.disclaimerChecked = event.target.checked;
        }
        if (event.target.name == 'disclaimer-reservation') {
            this.disclaimerReservation = event.target.checked;
        }

        if (this.startTime != null && this.endTime != null) {
            console.log('The value of the start time is', this.startTime);
            console.log('The value of the start date is', this.startDate);

            this.showCloseAndAddParticipants = true
            this.showCloseAtt = true
            AvailableSlots({ serviceAtFacility: this.servicesAtFacilityId, startingTime: this.startTime, endingTime: this.endTime, startingDate: this.startDate })
                .then((result) => {
                    this.showtext = true;
                    this.noofslots1 = result;
                    console.log('Remaining slots later are: ', this.noofslots1);

                })
                .catch((error) => {
                    console.error({
                        message: "Error occured on CalendarMap",
                        error,
                    });
                });



            return;
        }
        else {
            this.showCloseAndAddParticipants = false
            this.showCloseAtt = true
        }
    }


    checkPathValidity() {
        if(this.pathCurrentIndex == 5 &&  this.paymentDone == true){
            this.checkPathValidityPassed = false
        } else if (this.selectedStartDate > this.selectedEndDate) {
            this.showNotification('', 'Start Date cannot be Greater to End Date', 'warning', 'dismissable')
            this.checkPathValidityPassed = false
        } else if (this.showCloseAndAddParticipants == false) {
            this.showNotification('', 'All Bookings are Full at this Time, Try another Choice', 'warning', 'dismissable')
            this.checkPathValidityPassed = false
        } else {
            this.checkPathValidityPassed = true
        }
    }



    @track fileArray;
    uploadedFiles = [];

    handleUploadFinished(event) {

        //Code to handle the file upload
        console.log('Event Name: ' + event.target.name);
        const uploadedFiles = event.detail.files;
        let tempdata = [];
        for (let i = 0; i < uploadedFiles.length; i++) {
            console.log(JSON.stringify(uploadedFiles[i]))
            tempdata.push({
                fileId: uploadedFiles[i].documentId,
                contentVersionId: uploadedFiles[i].contentVersionId,
                name: uploadedFiles[i].name,
                index: event.target.name,
            });

        }
        this.name = uploadedFiles[0].name;
        console.log('NameofFile' + this.name);
        this.fileId = uploadedFiles[0].documentId;
        console.log('filesId' + this.fileId);

        console.log('tempdata' + JSON.stringify(tempdata));
        this.attendeeList[event.target.name].fileArray = tempdata;
        console.log('listofFiles' + JSON.stringify(this.attendeeList[event.target.name].fileArray));
        console.log('listofFilesUploaded' + JSON.stringify(this.attendeeList[EventTargetName].fileArray));

        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success!",
                message: "File attached successfully.",
                variant: "success"
            })
        );
    }

    handleRowAction(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {

            case 'delete':
                this.deleteFile(row);
                break;
            default:
                break;
        }
    }

    /*downloadFile(row) {
    const url = '/sfc/servlet.shepherd/document/download/' + row.fileId;
    window.open(url, '_blank');
    }*/

    deleteFile(row) {
        console.log('Row Number ' + JSON.stringify(row.index))
        this.attendeeList[row.index].fileArray = undefined;
        console.log('File Array: ' + this.fileArray)
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'File deleted successfully.',
                variant: 'success'
            })
        );
    }

    handleMembershipSelection(event) {
        console.log("the selected record id is" + event.detail);
    }

    toast(title) {
        const toastEvent = new ShowToastEvent({
            title,
            variant: "success"
        })
        this.dispatchEvent(toastEvent)
    }

    handlesignaturesubmit(e) {
        console.log("contentVersionIdSignature---eeeeee", e);
        console.log("contentVersionIdSignature---eeeeee222222", JSON.stringify(e));
        this.contentVersionIdSignature = e.detail;

        console.log("contentVersionIdSignature---", this.contentVersionIdSignature);

    }
    hideModalBox() {
        this.Showboolean = false;
    }
    handleFlowStatusChange(event) {
        if (event.detail.status === "FINISHED") {
            this.Showboolean = false;
        }
    } get taxesFixed() {
        return this.taxes.toFixed(2);
    }
    get eventAndTaxesCostFixed() {
        return this.eventAndTaxesCost.toFixed(2);
    }
    get eventCostFixed() {
        return this.eventCost.toFixed(2);
    }
    get discountamountFixed() {
        return this.discountamount.toFixed(2);
    }
    updateSignatureData(event) {
        this.signatureData = event.detail;
    }

    hideWaitingModalBox(){
        this.showPopup = false;
    }

}