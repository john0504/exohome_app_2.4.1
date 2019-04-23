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

@Component({
  selector: 'image-circle-text',
  templateUrl: 'image-circle-text.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageCircleText), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ImageCircleText extends UIComponentBase {
  title: string = '';
  logic: ReadOnlyLogic;
  state: ReadOnlyLogicState;
  logic2: ReadOnlyLogic;
  state2: ReadOnlyLogicState;
  testvalue: number = 70;

  constructor(
    ims: InformationModelService,
  ) {
    super(ims, 'image-circle-text', null);
    this.logic = new ReadOnlyLogic(ims, this.exoChange);
    this.state = this.logic.state;
    this.logic2 = new ReadOnlyLogic(ims, this.exoChange);
    this.state2 = this.logic2.state;
  }

  protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel) {
    if (!values || !model || !unitModel) return;
    this.title = model.title;
    if (index == 0) {
      this.state = this.logic.processLayout(values, key, unitModel);
    } else if (index == 1) {
      this.state2 = this.logic2.processLayout(values, key, unitModel);
    }
  }

  protected processUIState(currentValueState: any, key: string, index: number, model: ControlItemModel) {
    if (!key) return;
    if (index == 0) {
      this.state = this.logic.processUIState(currentValueState, key, model);
    } else if (index == 1) {
      this.state2 = this.logic2.processUIState(currentValueState, key, model);
    }
  }

  protected processDisableState(disableState, key: string, index: number, model: ControlItemModel) {
    if (index == 0) {
      this.state = this.logic.processDisableState(disableState, key, model);
    } else if (index == 1) {
      this.state2 = this.logic2.processDisableState(disableState, key, model);
    }
  }

  getColorIcon(value) {
    if (value > 71) {
      return "icon-pm25-deepred";
    } else if (value > 64) {
      return "icon-pm25-purple";
    } else if (value > 53) {
      return "icon-pm25-red";
    } else if (value > 41) {
      return "icon-pm25-orange";
    } else if (value > 35) {
      return "icon-pm25-yellow";
    } else if (value > -1) {
      return "icon-pm25-green";
    } else {
      return "icon-pm25-dark";
    }
  }

  getColorClass(value) {
    if (value > 71) {
      return "text-in-deepred";
    } else if (value > 64) {
      return "text-in-purple";
    } else if (value > 53) {
      return "text-in-red";
    } else if (value > 41) {
      return "text-in-orange";
    } else if (value > 35) {
      return "text-in-yellow";
    } else if (value > -1) {
      return "text-in-green";
    } else {
      return "text-in-dark";
    }
  }
}
