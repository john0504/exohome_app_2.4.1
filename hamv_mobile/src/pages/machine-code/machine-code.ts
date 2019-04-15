import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController,
  ViewController,
  NavParams,
} from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ThemeService } from '../../providers/theme-service';

@IonicPage()
@Component({
  selector: 'page-machine-code',
  templateUrl: 'machine-code.html'
})
export class MachineCodePage {

  callback;
  machineCode = "";

  constructor(
    public alertCtrl: AlertController,
    public appVersion: AppVersion,
    public nativeSettings: OpenNativeSettings,
    public navCtrl: NavController,
    public themeService: ThemeService,
    public viewCtrl: ViewController,
    private navParams: NavParams,
  ) {
    this.callback = this.navParams.get('callback');
  }

  closePage() {
    this.callback(this.machineCode);   
    this.viewCtrl.dismiss();
  }
}
