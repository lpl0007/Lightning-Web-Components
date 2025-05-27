import { LightningElement, api, wire } from 'lwc';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  @api mapMarkers = [];
  @api isLoading = false;
  isLoading = true;
  @api isRendered;
  @api latitude;
  @api longitude;
  
  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
  wiredBoatsJSON({error, data}) {
    if (data) {
      this.isLoading = false;
      this.createMapMarkers(data);
    } else if (error) {
      this.isLoading = false;
      this.dispatchEvent(
        new ShowToastEvent({
          title: ERROR_TITLE,
          message: error.body.message,
          variant: ERROR_VARIANT
        })
      );
    }
  }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    if (!this.isRendered) {
      this.isRendered = true;
      this.getLocationFromBrowser();
    }
  }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        }
      );
    }
  }
  
  // Creates the map markers
  createMapMarkers(boatData) {
    // Parse the JSON string to an array of objects
    const boats = JSON.parse(boatData);
    this.mapMarkers = boats.map(boat => {
      return {
        location: {
          latitude: boat.Geolocation__Latitude__s,
          longitude: boat.Geolocation__Longitude__s
        },
        title: boat.Name
      };
    });
    this.mapMarkers.unshift({
      location: {
        latitude: this.latitude,
        longitude: this.longitude
      },
      title: LABEL_YOU_ARE_HERE,
      icon: ICON_STANDARD_USER
    });
  }
}