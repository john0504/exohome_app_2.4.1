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
  RangeLogic,
  RangeLogicState,
  UIOptions,
  UIComponentBase,
  ValueItem
} from '../../../modules/information-model';

@Component({
  selector: 'image-range',
  templateUrl: 'image-range.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageRange), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class ImageRange extends UIComponentBase {
  title: string = '';
  logic: RangeLogic;
  state: RangeLogicState;

  constructor(
    ims: InformationModelService,
  ) {
    super(ims, 'image-range', null);
    this.logic = new RangeLogic(ims, this.exoChange);
    this.state = this.logic.state;
  }

  protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel, range?: any) {
    if (!values || !model || !unitModel || index !== 0) return;

    this.title = model.title;
    this.state = this.logic.processLayout(values, key, unitModel, range);
  }

  protected processUIState(currentValueState: any, key: string, index: number, model: ControlItemModel) {
    if (!key || index !== 0) return;
    this.state = this.logic.processUIState(currentValueState, key, model);
  }

  protected processDisableState(disableState, key: string, index: number, model: ControlItemModel) {
    if (index !== 0) return;
    this.state = this.logic.processDisableState(disableState, key, model);
  }

  sendValueUp() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaa");
    const index = this.state.currentIndex;
    const max = this.state.status.max;
    const min = this.state.status.min;
    const step = this.state.status.step;
    if (min + (index + 1) * step <= max) {
      this.sendValue({ value: index + 1 });
      this.valueChanges({ value: index + 1 });
    }
  }

  sendValueDown() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaa");
    const index = this.state.currentIndex;
    if (index > 0) {
      this.sendValue({ value: index - 1 });
      this.valueChanges({ value: index - 1 });
    }
  }

  sendValue({ value: index }) {
    if (this.model) {
      this.state = this.logic.sendValue(index);
    }
  }

  valueChanges({ value: index }) {
    this.state = this.logic.valueChanges(index);
  }

  getIconPicture(iconName) {
    if (this.state.disableState) {
      return "assets/img/img-none.png";
    }
    return "assets/img/" + iconName + ".png";
  }
}
