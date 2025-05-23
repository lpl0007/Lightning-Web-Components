 // imports
 import {LightningElement, api, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class BoatSearch extends LightningElement {
  @track isLoading = false;
  
  // Handles loading event
  handleLoading() {
    this.isLoading = true;
  }
  
  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false;
  }
  
  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    const boatTypeId = event.detail.boatTypeId;
    this.searchBoats(boatTypeId);
  }
  
  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Boat__c',
        actionName: 'new'
      }
    });
  }
}
