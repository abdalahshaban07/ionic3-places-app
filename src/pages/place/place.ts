import { PlacesService } from './../../services/places';
import { Place } from './../../models/place';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: Place
  index: number

  constructor(private placeServ: PlacesService, private navParams: NavParams, private viewCtel: ViewController) {
    this.place = this.navParams.get('place')
    this.index = this.navParams.get('index')
  }
  onLeave() {
    this.viewCtel.dismiss()
  }
  onDelete() {
    this.placeServ.deletePlace(this.index)
    this.onLeave()
  }

}
