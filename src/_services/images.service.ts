import { Injectable } from '@angular/core';

@Injectable()
export class ImagesService {

  private _isDialogOpened = false;
  private _imgUrl = '';

  get isOpened() {
    return this._isDialogOpened;
  }

  get currentURL() {
    return (this._isDialogOpened ? this._imgUrl : '');
  }

  constructor() { }

  open(url: string) {
    this._isDialogOpened = true;
    this._imgUrl = url;
    console.log(url);
  }

  close() {
    this._isDialogOpened = false;
  }
}
