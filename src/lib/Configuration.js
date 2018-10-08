import loMerge from 'lodash/merge';

export default class Configuration {
  
  constructor(configObject) {

    window.CookieConsent.buffer = {
      appendChild: [],
      insertBefore: []
    }

    // Wrapper filter function
    window.CookieConsent.wrapper = function() {};

    // Settings injector for users
    window.CookieConsent.setConfiguration = this.setConfiguration.bind(this);

    window.CookieConsent.config = {
      active: true,
      cookieExists: false,
      modalMainTextMoreLink: null,
      language: {
        current: 'en',
        locale: {
          en: {
            barMainText: 'This website uses cookies to ensure you get the best experience on our website.',
            barLinkSetting: 'Cookie Settings',
            barBtnAcceptAll: 'Accept all cookies',
            modalMainTitle: 'Cookie settings',
            modalMainText: 'Cookies are small piece of data sent from a website and stored on the user\'s computer by the user\'s web browser while the user is browsing. Your browser stores each message in a small file, called cookie. When you request another page from the server, your browser sends the cookie back to the server. Cookies were designed to be a reliable mechanism for websites to remember information or to record the user\'s browsing activity.',
            modalBtnSave: 'Save current settings',
            modalBtnAcceptAll: 'Accept all cookies and close',
            modalAffectedSolutions: 'Affected solutions:',
            learnMore: 'Learn More',
            on: 'On',
            off: 'Off',
          },
          hu: {
            barMainText: 'Ez a weboldal Sütiket használ a jobb felhasználói élmény érdekében.',
            barLinkSetting: 'Süti beállítások',
            barBtnAcceptAll: 'Minden süti elfogadása',
            modalMainTitle: 'Süti beállítások',
            modalMainText: 'A HTTP-süti (általában egyszerűen süti, illetve angolul cookie) egy információcsomag, amelyet a szerver küld a webböngészőnek, majd a böngésző visszaküld a szervernek minden, a szerver felé irányított kérés alkalmával. Amikor egy weboldalt kérünk le a szervertől, akkor a böngésző elküldi a számára elérhető sütiket. A süti-ket úgy tervezték, hogy megbízható mechanizmust biztosítsanak a webhelyek számára az információk megőrzésére vagy a felhasználók böngészési tevékenységének rögzítésére.',
            modalBtnSave: 'Beállítások mentése',
            modalBtnAcceptAll: 'Minden Süti elfogadása',
            modalAffectedSolutions: 'Mire lesz ez hatással:',
            learnMore: 'Tudj meg többet',
            on: 'Be',
            off: 'Ki',
          }
        }
      },
      categories: {},
      services: {}
    }

    this.setConfiguration(configObject);

  }

  setConfiguration(configObject) {
    // The user overrides the default config
    loMerge(window.CookieConsent.config, configObject);

    // The cookie overrides the default and user config
    this.cookieToConfig();

    console.log('config set')

    // We tell the world we did this
    document.dispatchEvent(new Event('CCConfigSet'));
  }

  cookieToConfig() {
    document.cookie.split(';').filter((item) => {
      if (item.indexOf('cconsent')  >= 0) {
        window.CookieConsent.config.cookieExists = true;
        var cookieData = JSON.parse(item.split('=')[1]);
        for (let key in cookieData) {
          window.CookieConsent.config.categories[key].checked = window.CookieConsent.config.categories[key].wanted = (cookieData[key] === true) ? true : false;
        }
        return true;
      }
    });
    
    return false;
  }

}