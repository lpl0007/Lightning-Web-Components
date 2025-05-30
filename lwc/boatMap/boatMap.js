import { api, LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
// import BOATMC from the message channel
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
const LONGITUDE_FIELD = "Boat__c.Geolocation__Longitude__s";
// Declare the const LATITUDE_FIELD for the boat's Latitude
const LATITUDE_FIELD = "Boat__c.Geolocation__Latitude__s";
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];

export default class BoatMap extends LightningElement {
    // private
    subscription = null;
    boatId;

    // Getter and Setter to allow for logic to run on recordId change
    // this getter must be public
    @api get recordId() {
        return this.boatId;
    }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    error = undefined;
    mapMarkers = [];
    
    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;

    // Getting record's location to construct map markers using recordId
    // Wire the getRecord method using ('$boatId')
    @wire(getRecord, {recordId: '$boatId', fields: BOAT_FIELDS})
    wiredRecord({ error, data }) {
    // Error handling
    if (data) {
        this.error = undefined;
        const longitude = data.fields.Geolocation__Longitude__s.value;
        const latitude = data.fields.Geolocation__Latitude__s.value;
        this.updateMap(longitude, latitude);
    } else if (error) {
        this.error = error;
        this.boatId = undefined;
        this.mapMarkers = [];
    }
}

connectedCallback() {
    if (this.subscription || this.recordId) {
        return;
    }
    this.subscribeMC();
}

subscribeMC() {
    let subscription = subscribe(this.messageContext, BOATMC, (message) => { this.boatId = message.recordId }, { scope: APPLICATION_SCOPE });
}

handleMessage(message) {
    this.boatId = message.recordId;
}

updateMap(Longitude, Latitude) {
    this.mapMarkers = [
        {
            location: {
                latitude: Latitude,
                longitude: Longitude
            },
            title: 'Boat Location'
        }
    ];
}

get showMap() {
    return this.mapMarkers.length > 0;
}
}