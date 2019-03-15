import {
  Component,
  forwardRef,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
  ComponentModel,
  ControlItemModel,
  InformationModelService,
  ReadOnlyLogic,
  ReadOnlyLogicState,
  UIOptions,
  UIComponentBase,
  ValueItem
} from '../../../modules/information-model';
import { Toast } from 'ionic-angular';
import { PopupService } from '../../../providers/popup-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'popup-text',
  templateUrl: 'popup-text.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PopupText), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class PopupText extends UIComponentBase {
  title: string = '';
  logic: ReadOnlyLogic;
  state: ReadOnlyLogicState;
  toast: Toast;

  constructor(
    ims: InformationModelService,
    private popupService: PopupService,
    private translate: TranslateService,
  ) {
    super(ims, 'popup-text', null);
    this.logic = new ReadOnlyLogic(ims, this.exoChange);
    this.state = this.logic.state;
  }

  protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel) {
    if (!values || !model || !unitModel || index !== 0) return;
    this.title = model.title;
    this.state = this.logic.processLayout(values, key, unitModel);
    if (this.state.currentValueItem.value && this.state.currentValueItem.value > 0) {
      this.setPopup(this.state.currentValueItem.value);
    }
  }

  protected processUIState(currentValueState: any, key: string, index: number, model: ControlItemModel) {
    if (!key || index !== 0) return;
    this.state = this.logic.processUIState(currentValueState, key, model);
  }

  protected processDisableState(disableState, key: string, index: number, model: ControlItemModel) {
    if (index !== 0) return;
    this.state = this.logic.processDisableState(disableState, key, model);
  }

  private setPopup(errorCode) {
    const errorCodeMsg = this.translate.instant('INFORMATION_MODEL.ERROR_MSG', { errorCode: errorCode });
    this.toast = this.popupService.makeToast({
      message: errorCodeMsg,
      cssClass: 'popup-page',
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X',
      dismissOnPageChange: true,
    });
  }
}
// export interface ToastOptions {
//   message?: string;
//   cssClass?: string;
//   duration?: number;
//   showCloseButton?: boolean;
//   closeButtonText?: string;
//   dismissOnPageChange?: boolean;
//   position?: string;
// }
