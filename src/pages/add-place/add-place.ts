import { HomePage } from './../home/home';
import { PlacesService } from './../../services/places';
import { Location } from './../../models/location';
import { SetLocationPage } from './../set-location/set-location';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'
import { ModalController, LoadingController, ToastController, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, FileError } from '@ionic-native/file';

declare var cordova: any

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  }

  locationIsSet = false;
  imageUrl: string

  constructor(
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private placeServ: PlacesService,
    private file: File,
    private navCtrl: NavController
  ) { }


  onSubmit(form: NgForm) {
    this.placeServ.addPlace(
      form.value.title,
      form.value.description,
      this.location,
      this.imageUrl
    )
    form.reset()
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    }
    this.imageUrl = ''
    this.locationIsSet = false
    this.navCtrl.pop()
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, { location: this.location, isSet: this.locationIsSet })
    modal.present()
    modal.onDidDismiss((data) => {
      if (data) {
        this.location = data.location
        this.locationIsSet = true
      }
    })
  }

  onLocat() {
    const loader = this.loadingCtrl.create({
      content: 'Getting your Location ...',
    })
    loader.present()
    this.geolocation.getCurrentPosition()
      .then(location => {
        loader.dismiss()
        console.log(location)
        this.location.lat = location.coords.latitude
        this.location.lng = location.coords.longitude
        this.locationIsSet = true
      })
      .catch(error => {
        loader.dismiss()
        const toast = this.toastCtrl.create({
          message: 'Could Not Get Location ...',
          duration: 2500,
        })
        toast.present()
      })
  }

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    // mediaType: this.camera.MediaType.ALLMEDIA
    // cameraDirection: 0

  }

  onTakePhoto() {
    this.camera.getPicture(this.options)
      .then(imageData => {
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        this.file.createDir(this.file.dataDirectory, 'ionic', true)
        this.file.moveFile(path, currentName, this.file.dataDirectory, newFileName) //cordova.file.dataDirectory
          .then((data) => {
            this.imageUrl = data.nativeURL
            this.camera.cleanup()
          })
          .catch((error: FileError) => {
            this.imageUrl = ''
            const toast = this.toastCtrl.create({
              message: 'Could Not Save This Image Try Again...',
              duration: 2000
            })
            toast.present()
            this.camera.cleanup()
          })
        // this.imageUrl = "data:image/jpeg;base64," + imageData;
        this.imageUrl = imageData
      })
      .catch(error => {
        console.log(error)
      })
  }

}
