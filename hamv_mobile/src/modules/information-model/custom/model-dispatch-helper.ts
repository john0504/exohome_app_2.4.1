import { Injectable } from '@angular/core';

import { Device } from 'app-engine';

@Injectable()
export class ModelDispatchHelper {

    constructor(
    ) {
    }

    public getUIModelViaCustomLogic(device: Device): string {
        // If there is any custom logic needs to be extended, please re-write this function.
        let modelId = device.profile.esh.deviceId;
        switch (modelId) {
            case "1":
                return "SA01";
            case "2":
                return "SA02";
            case "3":
                return "SA03";
            case "4":
                return "SA04";
            case "5":
                return "SA05";
            case "6":
                return "SA06";
            case "7":
                return "SA07";
            case "8":
                return "SA08";
            case "9":
                return "SA09";
            case "A":
            case "a":
                return "SA10";
            case "B":
            case "b":
                return "SA11";
            case "C":
            case "c":
                return "SA12";
            case "D":
            case "d":
                return "SA13";
            case "E":
            case "e":
                return "SA14";
            case "F":
            case "f":
                return "SA15";
            case "10":
                return "SA16";
            case "11":
                return "SA17";
            case "12":
                return "SA18";
        }
        return null;
    }
}
