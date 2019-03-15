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
  UIOptions,
  UIComponentBase,
  ToggleLogic,
  ToggleLogicState,
  ValueItem,
} from '../../../modules/information-model';

@Component({
    selector: 'image-toggle',
    templateUrl: 'image-toggle.html',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ImageToggle), multi: true }],
    encapsulation: ViewEncapsulation.None,
})
export class ImageToggle extends UIComponentBase {
    title: string = '';
    logic: ToggleLogic;
    state: ToggleLogicState;

    constructor(
        ims: InformationModelService,
    ) {
        super(ims, 'image-toggle', null);
        this.logic = new ToggleLogic(ims, this.exoChange);
        this.state = this.logic.state;
    }

    protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel) {
        if (!values || !model || !unitModel || index !== 0) return;
        this.title = model.title;
        this.state = this.logic.processLayout(values, key, unitModel);
    }

    protected processUIState(currentValueState: any, key: string, index: number, model: ControlItemModel) {
        if (!key || index !== 0) return;
        this.state = this.logic.processUIState(currentValueState, key, model);
    }

    protected processDisableState(disableState, key: string, index: number, model: ControlItemModel) {
        if (index !== 0) return;
        this.state = this.logic.processDisableState(disableState, key, model);
    }

    goChange(disabled) {
        if (this.model && !disabled) {
            this.state = this.logic.sendValue(!this.state.currentState);
        }
    }
}
