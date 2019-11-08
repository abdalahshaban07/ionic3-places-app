import { PlacePage } from './../place/place';
import { PlacesService } from './../../services/places';
import { Place } from './../../models/place';
import { AddPlacePage } from './../add-place/add-place';
import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  addPlacePage = AddPlacePage
  places: Place[] = []
  constructor(public modalCtrl: ModalController, private placeServ: PlacesService) {
  }

  ngOnInit() {
    this.fetchData()
  }

  fetchData() {
    this.placeServ.fetchPlaces()
      .then((places: Place[]) => {
        this.places = places
      })
  }

  ionViewWillEnter() {
    this.places = this.placeServ.loadPlace()
  }

  onOpenPlace(place: Place, index: number) {
    const modal = this.modalCtrl.create(PlacePage, { place: place, index: index })
    modal.present()
    modal.onDidDismiss(() => {
      this.fetchData()
    })
  }

}
