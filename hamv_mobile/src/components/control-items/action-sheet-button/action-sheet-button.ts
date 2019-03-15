import {
    Component,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import {
    ButtonGroupLogic,
    ButtonGroupLogicState,
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
    selector: 'action-sheet-button',
    templateUrl: 'action-sheet-button.html',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ActionSheetButton), multi: true }],
    encapsulation: ViewEncapsulation.None,
})
export class ActionSheetButton extends UIComponentBase {
    title: string;
    logic: ButtonGroupLogic;
    state: ButtonGroupLogicState;

    constructor(
        private translate: TranslateService,
        private actionSheetCtrl: ActionSheetController,
        ims: InformationModelService,
    ) {
        super(ims, 'action-sheet-button', null);
        this.logic = new ButtonGroupLogic(ims, this.exoChange);
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

        this.state.buttons.forEach(button => {
            let items = {
                cssClass: 'action-sheet',
                icon: button.icon ? button.icon + '-off' : '',
                text: this.translate.instant(button.text),
                handler: () => this.onButtonClicked(button.value)
            };
            if (button.value == this.state.currentValueItem.value) {
                items.cssClass = 'action-sheet-select';
                items.icon = button.icon ? button.icon + '-on' : '';
            }
            buttons.push(items);
        });
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
