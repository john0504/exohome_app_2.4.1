import { WarrantyPage } from './warranty';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    WarrantyPage
  ],
  imports: [
    IonicPageModule.forChild(WarrantyPage),
    TranslateModule,
    ComponentsModule,
    DirectivesModule,
  ],
  entryComponents: [
    WarrantyPage
  ]
})
export class WarrantyPageModule { }
