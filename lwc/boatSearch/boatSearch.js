 // imports
 import {LightningElement, api, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

export default class BoatSearch extends NavigationMixin(LightningElement) {
  @track isLoading = false;
  boatTypeId = '';
  
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
    this.boatTypeId = event.detail.boatTypeId;
    const resultsCmp = this.template.querySelector('c-boat-search-results');
    if (resultsCmp && typeof resultsCmp.searchBoats === 'function') {
      resultsCmp.searchBoats(this.boatTypeId);
    }
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