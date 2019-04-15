import {  MachineCodePage } from './machine-code';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    MachineCodePage
  ],
  imports: [
    IonicPageModule.forChild( MachineCodePage),
    TranslateModule,
    ComponentsModule,
    DirectivesModule,
  ],
  entryComponents: [
    MachineCodePage
  ]
})
export class MachineCodePageModule { }
