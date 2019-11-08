import { File } from '@ionic-native/file';
import { Injectable } from '@angular/core';
import { Location } from './../models/location';
import { Place } from './../models/place';
import { Storage } from "@ionic/storage"


declare var cordova: any

@Injectable()
export class PlacesService {
    private places: Place[] = []

    constructor(private file: File, private storage: Storage) { }

    addPlace(title: string, description: string, location: Location, imageUrl: string) {
        const place = new Place(title, description, location, imageUrl)
        this.places.push(place)
        this.storage.set('places', this.places)
            .then()
            .catch(error => {
                this.places.splice(this.places.indexOf(place), 1)
            })
    }

    loadPlace() {
        return this.places.slice()
    }

    fetchPlaces() {
        return this.storage.get('places')
            .then((places: Place[]) => {
                this.places = places != null ? places : []
                return this.places.slice()
            })
            .catch(error => {
                console.log(error)
            })
    }

    deletePlace(index: number) {
        const place = this.places[index]
        this.places.splice(index, 1)
        this.storage.set('places', this.places)
            .then(() => {
                this.removeFile(place)
            })
            .catch(error => {
                console.log(error)
            })
    }

    private removeFile(place: Place) {
        const currentName = place.imageUrl.replace(/^.*[\\\/]/, '')
        this.file.removeFile(this.file.dataDirectory, currentName)
            .then(() => {
                console.log('Removed File');
            })
            .catch(error => {
                console.log('Error While Removing File');
                this.addPlace(
                    place.title,
                    place.description,
                    place.location,
                    place.imageUrl
                )
            })
    }
}