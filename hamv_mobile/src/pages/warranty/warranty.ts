import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
} from 'ionic-angular';

import { ViewStateService } from '../../providers/view-state-service';
import { UtilsProvider } from '../../providers/utils-provider';

@IonicPage()
@Component({
  selector: 'page-warranty',
  templateUrl: 'warranty.html'
})
export class WarrantyPage {

  deviceMachineType: string = "";

  constructor(
    public navCtrl: NavController,
    public viewStateService: ViewStateService,
    private utilsProvider: UtilsProvider,
  ) {

  }  

  onQRcode() {
    this.navCtrl.push('ScanPage', { callback: this.getMachineCodeCallback });
  }

  goRegister() {
    const url = 'http://www.cectco.com';
      this.utilsProvider.openLink(url);
  }

  getMachineCodeCallback = (params) => {
    return new Promise(() => {
      if (params) {
        this.deviceMachineType = params;
      }
    });
  }
}
