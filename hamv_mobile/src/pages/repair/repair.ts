import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, ViewController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ThemeService } from '../../providers/theme-service';

@IonicPage()
@Component({
  selector: 'page-repair',
  templateUrl: 'repair.html'
})
export class RepairPage {

  constructor(
    public alertCtrl: AlertController,
    public appVersion: AppVersion,
    public nativeSettings: OpenNativeSettings,
    public navCtrl: NavController,
    public themeService: ThemeService,
    public viewCtrl: ViewController,
  ) {
  }

  machineCode: string = "";

  onNext() {
    
  }

  onMachineCode() {
    this.navCtrl.push('MachineCodePage', { callback: this.getMachineCodeCallback });
  }

  closePage() {
    this.viewCtrl.dismiss();
  }  

  getMachineCodeCallback = (params) => {
    return new Promise(() => {
      if (params) {
        this.machineCode = params;
      }
    });
  }
}
