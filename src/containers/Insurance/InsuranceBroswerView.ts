import { ipcMain, BrowserView, BrowserWindow } from 'electron';

const urls = [
  'https://www.aflac.co.jp/gan/days1all_in/simulation.html',
  'https://www.aflac.co.jp/iryo/everprime/simulation.html',
  'https://www.aflac.co.jp/kaigo/r_kaigo/simulation.html'
];
const SCROLL_OFFSET = 937 / 2;

export function createInsuranceView(mainWindow: BrowserWindow) {
  const insuranceView = new BrowserView();
  const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

  let age = 0;
  let gender = 'male';
  let urlIndex = 0;
  let type = 1;

  ipcMain.on('create-insurance-browserview', (_, params) => {
    if (!mainWindow) return;
    age = params.age;
    gender = params.gender;
    urlIndex = params.urlIndex;
    type = params.type;

    mainWindow.addBrowserView(insuranceView);
    insuranceView.setBounds({
      x: 0,
      y: 0,
      width: 1080,
      height: 1265,
    });
    insuranceView.webContents.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
    );
    insuranceView.webContents.loadURL(urls[params.urlIndex]);
    
    insuranceView.webContents.enableDeviceEmulation({
      screenPosition: "mobile",
        screenSize: {
            width: 1080,
            height: 1265,
        },
        viewPosition: {
            x: 0,
            y: 0,
        },
        viewSize: {
            width: 1080,
            height: 1265,
        },
        deviceScaleFactor: 0,
        scale: 1.3,
    })
    // insuranceView.webContents.setZoomLevel(1.4);
    // isDevelopment && insuranceView.webContents.openDevTools();
  });

  insuranceView.webContents.on('did-finish-load', () => {
    insuranceView.webContents.insertCSS(`[class*=headerRightBox] { display: none }`)
    insuranceView.webContents.insertCSS(`[class*=headerShadow] { display: none }`)
  })

  insuranceView.webContents.on('dom-ready', () => {
    const script = createBindingValueScript(age, gender, type, urlIndex);
    insuranceView.webContents.executeJavaScript(script)
  });

  ipcMain.on('quit-insurance-browserview', () => {
    if (!mainWindow) return;
    mainWindow.removeBrowserView(insuranceView);
  });

  ipcMain.on('scroll-up', () => {
    const script = createScrollUpScript();
    insuranceView.webContents.executeJavaScript(script, true)
  })

  ipcMain.on('scroll-down', () => {
    const script = createScrollDownScript();
    insuranceView.webContents.executeJavaScript(script, true)
  })
}

function createBindingValueScript(
  age: number,
  gender: string,
  type: number,
  urlIndex: number
) {
  let script = '';

  if (urlIndex === 0) {
    script = `
      let element_age = document.getElementById('age');
      let element_male = document.getElementById('sex_male_ari');
      let element_female = document.getElementById('sex_female_nashi');

      if (element_age && element_male && element_female) {
        element_age.value = ${age};
        if ('${gender}' === 'male') {
          element_male.checked = true;
          element_female.checked = false;
        } else {
          element_male.checked = false;
          element_female.checked = true;
        }

        const ev = document.createEvent('HTMLEvents');
        ev.initEvent('change', false, true);
        element_age.dispatchEvent(ev);
      }
    `;
  } else if(urlIndex === 1) {
    script = `
      let element_age = document.getElementsByName('age')[0];
      let element_male = document.getElementById('sex_male');
      let element_female = document.getElementById('sex_female');
      let element_everprime = document.getElementById('everprime');
      let element_ladys_everprime = document.getElementById('ladys_everprime');
      let element_everprime_jok = document.getElementById('everprime_jok');

      if (element_age && element_male && element_female) {
        element_age.value = ${age};
        if ('${gender}' === 'male') {
          element_male.checked = true;
          element_female.checked = false;
        } else {
          element_male.checked = false;
          element_female.checked = true;
        }
        if (${type} === 1) {
          element_everprime.checked = true;
          element_ladys_everprime.checked = false;
          element_everprime_jok.checked = false;
        } else if(${type} === 2) {
          element_everprime.checked = false;
          element_ladys_everprime.checked = true;
          element_everprime_jok.checked = false;
        } else {
          element_everprime.checked = false;
          element_ladys_everprime.checked = false;
          element_everprime_jok.checked = true;
        }

        const ev = document.createEvent('HTMLEvents');
        ev.initEvent('change', false, true);
        element_age.dispatchEvent(ev);
      }
    `;
  } else {
    script = `
      let element_age = document.querySelector('#jqAge > select')
      let element_male = document.getElementById('sex_male');
      let element_female = document.getElementById('sex_female');

      if(element_age && element_male && element_female) {
        element_age.value = ${age};
        if ('${gender}' === 'male') {
          element_male.checked = true;
          element_female.checked = false;
        } else {
          element_male.checked = false;
          element_female.checked = true;
        }

        const ev = document.createEvent('HTMLEvents');
        ev.initEvent('change', false, true);
        element_age.dispatchEvent(ev);
      }
    `
  }

  return script
}

function createScrollUpScript() {
  return `
    var currentPos = window.scrollY;
    var pos = (currentPos - ${SCROLL_OFFSET} < 0) ? 0 : currentPos - ${SCROLL_OFFSET};
    var height = document.body.clientHeight;
    if (currentPos > height - ${SCROLL_OFFSET} * 2) {
      pos = height - 3 * ${SCROLL_OFFSET};
    }
    
    window.scrollTo(0, pos);
  `
}

function createScrollDownScript() {
  return `
    var currentPos = window.scrollY;
    var pos = Math.min(currentPos + ${SCROLL_OFFSET}, document.body.clientHeight)
    window.scrollTo(0, pos);
  `
}
