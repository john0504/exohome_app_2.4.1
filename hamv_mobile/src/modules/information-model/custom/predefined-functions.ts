export const functionMap = {
  tempCelsius: (val) => {
    if (val === -32767 || val === undefined || val === null) {
      return {
        value: val,
        text: '--°C',
        icon: 'thermostat',
      };
    }
    return {
      value: val,
      text: round(val, 1) + '°C',
      icon: 'thermostat',
    };
  },
  tempCelsiusToFahrenheit: (val) => {
    if (val === -32767 || val === undefined || val === null) {
      return {
        value: val,
        text: '--°F',
        icon: 'thermostat',
      };
    }
    return {
      value: val,
      text: round(val * (9 / 5) + 32, 2) + '°F',
      icon: 'thermostat',
    };
  },
  tempFahrenheit: (val) => {
    if (val === -32767 || val === undefined || val === null) {
      return {
        value: val,
        text: '--°F',
        icon: 'thermostat',
      };
    }
    return {
      value: val,
      text: round(val, 2) + '°F',
      icon: 'thermostat',
    };
  },
  tempFahrenheitToCelsius: (val) => {
    if (val === -32767 || val === undefined || val === null) {
      return {
        value: val,
        text: '--°C',
        icon: 'thermostat',
      };
    }
    return {
      value: val,
      text: round((val - 32) * 5 / 9, 2) + '°C',
      icon: 'thermostat',
    };
  },
  humidity: (val) => {
    if (val === -32767 || val === undefined || val === null) {
      return {
        value: val,
        text: '--%',
      };
    }
    return {
      value: val,
      text: round(val, 1) + '%',
    };
  },
  timer: (val) => {
    if (val === -32767 || val === undefined || val === null) {
      return {
        value: val,
        text: '--:--',
      };
    }
    let hour = val / 60 | 0;
    let min = val % 60;
    let hourS = hour < 10 ? '0' + hour : hour + '';
    let minS = min < 10 ? '0' + min : min + '';
    return {
      value: val,
      text: hourS + ':' + minS,
    };
  },
  //create more from here
  timerHour: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--:--',
      };
    }
    let hour = val;
    let hourS = hour < 10 ? '0' + hour : hour + '';
    return {
      value: val,
      text: hourS + ':00',
    };
  },
  netHour: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--:--',
      };
    }
    let hour = val;
    let hourS = hour < 10 ? '0' + hour : hour + '';
    if (val >= 3000) {
      return {
        value: val,
        text: hourS + ' hr',
        icon: 'net_hour_red',
      };
    }
    return {
      value: val,
      text: hourS + ' hr',
      icon: 'net_hour',
    };
  },
  dust: (val) => {
    if (val < 0) {
      return {
        value: val,
        text: '--μg/m³',
        icon: 'cloud',
      };
    }
    return {
      value: val,
      text: val + 'μg/m³',
      icon: 'cloud',
    };
  },
  text: (val) => {
    if (val === undefined || val === null || val === -32767) {
      return {
        value: val,
        text: '--',
      };
    }
    return {
      value: val,
      text: round(val, 2) + '',
    };
  },
  airbox_humi: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--　　%',
      };
    }
    return {
      value: val,
      text: round(val / 100, 1) + '　　%',
    };
  },
  airbox_temp: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--　　°C',
      };
    }
    return {
      value: val,
      text: round(val / 100, 1) + '　　°C',
    };
  },
  airbox_pm25: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '-- μg/m³',
      };
    }
    return {
      value: val,
      text: round(val, 0) + ' μg/m³',
    };
  },
  pm25: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '-- μg/m³',
        icon: 'pm25',
      };
    }
    if (val < 36) {
      return {
        value: val,
        text: round(val, 0) + ' μg/m³',
        icon: 'pm25_green',
      };
    } else if (val < 59) {
      return {
        value: val,
        text: round(val, 0) + ' μg/m³',
        icon: 'pm25_yellow',
      };
    } else if (val < 71) {
      return {
        value: val,
        text: round(val, 0) + ' μg/m³',
        icon: 'pm25_red',
      };
    } else if (val < 500) {
      return {
        value: val,
        text: round(val, 0) + ' μg/m³',
        icon: 'pm25_purple',
      };
    } else {
      return {
        value: val,
        text: '-- μg/m³',
        icon: 'pm25',
      };
    }
  },
  airbox_co2: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--　ppm',
      };
    }
    return {
      value: val,
      text: round(val, 0) + '　ppm',
    };
  },
  co2: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--　ppm',
        icon: 'co2',
      };
    }
    if (val < 801) {
      return {
        value: val,
        text: round(val, 0) + '　ppm',
        icon: 'co2_green',
      };
    } else if (val < 901) {
      return {
        value: val,
        text: round(val, 0) + '　ppm',
        icon: 'co2_yellow',
      };
    } else if (val < 5000) {
      return {
        value: val,
        text: round(val, 0) + '　ppm',
        icon: 'co2_red',
      };
    } else {
      return {
        value: val,
        text: '--　ppm',
        icon: 'co2',
      };
    }
  },
  airbox_voc: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--　 ppb',
      };
    }
    return {
      value: val,
      text: round(val, 0) + '　 ppb',
    };
  },
  ugm3: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--μg/m³',
      };
    }
    return {
      value: val,
      text: round(val, 0) + 'μg/m³',
    };
  },
  ppm: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--ppm',
      };
    }
    return {
      value: val,
      text: round(val, 0) + 'ppm',
    };
  },
  ppb: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--ppb',
      };
    }
    return {
      value: val,
      text: round(val, 0) + 'ppb',
    };
  },
  airbox_level: (val) => {
    if (val > 5 || val < 0) {
      return {
        value: val,
        text: '',
        icon: 'level0',
      };
    }
    switch (val) {
      case 0:
        return {
          value: val,
          text: '',
          icon: 'level0',
        };
      case 1:
        return {
          value: val,
          text: '',
          icon: 'level1',
        };
      case 2:
        return {
          value: val,
          text: '',
          icon: 'level2',
        };
      case 3:
        return {
          value: val,
          text: '',
          icon: 'level3',
        };
      case 4:
        return {
          value: val,
          text: '',
          icon: 'level4',
        };
      case 5:
        return {
          value: val,
          text: '',
          icon: 'level5',
        };
    }
    return {
      value: val,
      text: '',
      icon: 'level0',
    };
  },
  div10: (val) => {
    if (val === -32767) {
      return {
        value: val,
        text: '--',
      };
    }
    return {
      value: val,
      text: round(val * 10, 2) + '',
    };
  },
};

function round(value: number, precision: number) {
  const base = 10 ** precision;
  return Math.round(value * base) / base;
}
