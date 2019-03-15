import {
    Component,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
    RangeLogic,
    RangeLogicState,
    ComponentModel,
    ControlItemModel,
    InformationModelService,
    UIOptions,
    UIComponentBase,
    ValueItem
} from '../../../modules/information-model';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController } from 'ionic-angular';

@Component({
    selector: 'action-sheet-range',
    templateUrl: 'action-sheet-range.html',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ActionSheetRange), multi: true }],
    encapsulation: ViewEncapsulation.None,
})
export class ActionSheetRange extends UIComponentBase {
    title: string;
    logic: RangeLogic;
    state: RangeLogicState;

    constructor(
        private translate: TranslateService,
        private actionSheetCtrl: ActionSheetController,
        ims: InformationModelService,
    ) {
        super(ims, 'action-sheet-range', null);
        this.logic = new RangeLogic(ims, this.exoChange);
        this.state = this.logic.state;
    }

    protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel, range?: any) {
        if (!values || !model || !unitModel || index != 0) return;

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

    onButtonClicked(val: any) {
        if (this.model) {
            this.state = this.logic.sendValue(val);
        }
    }

    buttonClick(disabled) {
        if (disabled) {
            return;
        }
        const buttons: Array<any> = [];
        const texts: Array<string> = [];
        for (let currentIndex = this.state.status.min; currentIndex <= this.state.status.max; currentIndex += this.state.status.step) {
            let valueItem = this.logic.getValueItem(currentIndex);
            let currentValueItem = this.logic.getValueItem(this.state.currentValueItem.value);
            if (texts.indexOf(valueItem.text) == -1 && valueItem.text.indexOf('MIN') == -1) {
                texts.push(valueItem.text);
                let items = {
                    cssClass: 'action-sheet',
                    icon: this.state.currentValueItem.icon ? this.state.currentValueItem.icon + '-off' : '',
                    text: this.translate.instant(valueItem.text),
                    handler: () => this.onButtonClicked(currentIndex)
                };
                if (currentValueItem.text == valueItem.text) {
                    items.cssClass = 'action-sheet-select';
                    items.icon = this.state.currentValueItem.icon ? this.state.currentValueItem.icon + '-on' : '';
                }
                buttons.push(items);
            }            
        }
        let items = {
            cssClass: 'action-sheet-cancel',
            icon: '',
            text: this.translate.instant('INFORMATION_MODEL.CANCEL'),
            role: 'cancel',
        };
        if (this.state.currentValueItem.icon) {
            items.icon = 'close';
        }
        buttons.push(items);

        const actionSheet = this.actionSheetCtrl.create({
            title: this.translate.instant(this.title),
            cssClass: 'action-sheet-page',
            buttons
        });
        actionSheet.present();
    }
}
