import {
  Component,
  forwardRef,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppTasks } from 'app-engine';
import {
  Subject,
  Subscription,
} from 'rxjs';
import { empty } from 'rxjs/observable/empty';
import { defer } from 'rxjs/observable/defer';
import {
  catchError,
  debounceTime,
  switchMap,
  map,
} from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';

import {
  ComponentModel,
  ControlItemModel,
  InformationModelService,
  ChartLogic,
  ChartLogicState,
  UIOptions,
  UIComponentBase,
  ValueItem,
} from '../../../modules/information-model';
import { DatetimeSelector } from '../../chart-components/datetime-selector/datetime-selector';
import { DataTransform } from '../../chart-components/data-transform';
import { EchartsDatasetTransform } from '../../chart-components/transform/echarts-dataset-transform';
import { ValueReplacerPipe } from '../../../modules/information-model/pipes/value-replacer/value-replacer';
import { LineChartModel } from './line-chart.model';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LineChart), multi: true }],
  encapsulation: ViewEncapsulation.None,
})
export class LineChart extends UIComponentBase implements OnInit, OnDestroy {
  title: string = '';
  logics: Array<ChartLogic>;
  states: Array<ChartLogicState>;
  deviceSn: string;
  private _ims: InformationModelService;

  private debounceTrigger: Subject<any> = new Subject();
  private downloadWorker: Subscription;

  dtSelector: DatetimeSelector;
  transform: DataTransform;
  aggregateMethod: string = 'sum';
  period: number = 1;
  electricityPrice: number = 1;
  isPrice = false;

  _noData: boolean = true;
  _mergeOptions;
  _options;
  _lineChartModel: LineChartModel;
  _pipe = new ValueReplacerPipe();
  _modelCallback = (v, index) => {
    const vText = this.states[index].getValueText(v);
    const tText = this.translate.instant(vText);
    return this._pipe.transform(tText, v);
  }

  constructor(
    ims: InformationModelService,
    private appTasks: AppTasks,
    private translate: TranslateService,
    private storage: Storage,
  ) {
    super(ims, 'line-chart', null);
    this._lineChartModel = new LineChartModel();
    this._lineChartModel.valueTextCallback = this._modelCallback;
    this._options = cloneDeep(this._lineChartModel.basicModel);
    this._ims = ims;
    this.logics = [];
    this.states = [];
    this.dtSelector = new DatetimeSelector();
    this.transform = new EchartsDatasetTransform();
  }

  ngOnInit() {
    this.downloadWorker = this.debounceTrigger
      .pipe(
        debounceTime(500),
        switchMap(() => {
          const promises = this.states.map(state => {
            this.deviceSn = this.data && this.data.deviceSn;
            if (this.isPrice) {
              this.getElectricityPrice();
            }
            return this.requestData(this.deviceSn, state.key);
          });
          return defer(() => Promise.all(promises))
            .pipe(
              map(results => this.processResults(null, results)),
              catchError(e => {
                this.processResults(e);
                return empty();
              })
            );
        })
      )
      .subscribe();
    this.debounceTrigger.next();
  }

  ngOnDestroy() {
    this.downloadWorker.unsubscribe();
  }

  protected processLayout(model: ComponentModel, values: Array<ValueItem> | UIOptions, key: string, index: number, unitModel: ControlItemModel) {
    if (!values || !model || !unitModel || index !== 0) return;
    this.title = model.title;
    const logic = this.getLogic(index);
    const state = logic.processLayout(values, key, unitModel);
    this.states[index] = state;
  }

  protected processUIState(currentValueState: any, key: string, index: number, model: ControlItemModel) {
    if (!key || index !== 0) return;
    const logic = this.getLogic(index);
    const state = logic.processUIState(currentValueState, key, model);
    this.states[index] = state;
    this.period = model.options ? model.options.period : 1;
    if (model.options && model.options.price == 1) {
      this.isPrice = true;
    }
  }

  protected processDisableState(disableState, key: string, index: number, model: ControlItemModel) {
    if (!key || index !== 0) return;
    const logic = this.getLogic(index);
    const state = logic.processDisableState(disableState, key, model);
    this.states[index] = state;
  }

  private getLogic(index: number) {
    const logic = this.logics[index] || new ChartLogic(this._ims, this.exoChange);
    this.logics[index] = logic;
    return logic;
  }

  changePeriod(period: string) {
    this.dtSelector.changePeriod(period, () => this.debounceTrigger.next());
  }

  changeRange(direction: number) {
    this.dtSelector.changeRange(direction, false, () => this.debounceTrigger.next());
  }

  private requestData(deviceSn: string, key: string) {
    if (!deviceSn || !key) return Promise.reject('No device SN or field as inputs');
    const range = this.dtSelector.rangeItem;
    let sampling_size;
    switch (this.dtSelector.period) {
      case 'day':
        sampling_size = '1h';
        break;
      case 'week':
        sampling_size = '1d';
        break;
      case 'month':
        sampling_size = '1d';
        break;
      case 'year':
        sampling_size = '1d';
        break;
    }
    var start_time = range.startTime + 8 * 60 * 60 * 1000;
    var end_time = range.endTime + 8 * 60 * 60 * 1000;
    return this.appTasks
      .getHistoricalData(deviceSn, key, {
        start_time: start_time + 'ms',
        end_time: end_time + 'ms',
        order_by: 'asc',
        sampling_size,
        aggregate: this.aggregateMethod
      });
  }

  private processResults(e, results?) {
    if (e) {
      this._noData = true;
      this._options = cloneDeep(this._lineChartModel.basicModel);
      return;
    }

    let my_results = [];
    let my_results_datas = [];
    if (this.dtSelector.period == 'year' && this.aggregateMethod == 'sum') {
      var sum = 0;
      var last_time = "";
      results.forEach((historicalData) => {
        historicalData.forEach(element => {
          let date = JSON.stringify(element.time).substring(9, 11);
          if (date == "01" && last_time != "") {
            my_results_datas.push({ "time": last_time, "value": sum == 0 ? "none" : { "sum": sum } });
            sum = 0;
          }
          if (element.value != "none") {
            sum += element.value["sum"];
          }
          last_time = element.time;
        });
      });
      my_results_datas.push({ "time": last_time, "value": sum == 0 ? "none" : { "sum": sum } });
      my_results.push(my_results_datas);
    } else {
      my_results = results;
    }

    my_results.forEach((historicalData, index) => {
      let count = 0;
      let sum = 0;
      historicalData.forEach(element => {
        const v = this.getDataValue(element.value, this.aggregateMethod);
        if (typeof v === 'number') {
          element.value[this.aggregateMethod] = element.value[this.aggregateMethod] * this.period * this.electricityPrice;
          sum += element.value[this.aggregateMethod];
          count++;
        }
      });
      this._noData = count <= 0;
      // let avgText = "";
      let totalText = "";
      if (this._noData) {
        // avgText =  this.translate.instant('HISTORICAL_CHART.AVERAGE') + " : " + this._modelCallback(-32767, index);
        totalText = this.translate.instant('HISTORICAL_CHART.TOTAL') + " : " + this._modelCallback(-32767, index);

      } else {
        // avgText = this.translate.instant('HISTORICAL_CHART.AVERAGE') + " : " + this._modelCallback(sum / count, index);
        totalText = this.translate.instant('HISTORICAL_CHART.TOTAL') + " : " + this._modelCallback(sum, index);
      }
      // const g = this._lineChartModel.averageTag(avgText);
      const g = this._lineChartModel.totalTag(totalText);
      const echartModel = this.transform.transform({
        historicalData,
        seriesColumnLayout: true,
        timePeriodFilter: this.dtSelector.period,
        modelInfo: {
          title: this.title,
        },
        aggregate: this.aggregateMethod
      });

      echartModel.graphic = [g];
      this._mergeOptions = echartModel;
    });
  }

  private getDataValue(value: any, aggregate?: string) {
    try {
      if (!aggregate) {
        return value === 'none' || value === -32767 ? undefined : value;
      }

      const v = value[aggregate];
      return this.getDataValue(v);
    } catch {
      return undefined;
    }
  }

  getElectricityPrice() {
    return this.storage.get('electricityPrice' + this.deviceSn)
      .then((electricityPrice) => {
        if (electricityPrice) {
          this.electricityPrice = electricityPrice;
        } else {
          this.electricityPrice = 3.0;
        }
      });
  }
}
