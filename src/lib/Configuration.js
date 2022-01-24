import Utilities from "./Utilities";

export default class Configuration {

  constructor(configObject) {

    window.CookieConsent.buffer = {
      appendChild: [],
      insertBefore: []
    }

    // Wrapper filter function
    window.CookieConsent.wrapper = function () { };

    // Settings injector for users
    window.CookieConsent.setConfiguration = this.setConfiguration.bind(this);

    window.CookieConsent.config = {
      active: true,
      cookieExists: false,
      cookieVersion: 1,
      modalMainTextMoreLink: 'http://www.google.com',
      modalMainCookiePolicyLink: null,
      barTimeout: 1000,
      theme: {
        barColor: '#2C7CBF',
        barTextColor: '#FFF',
        barMainButtonColor: '#FFF',
        barMainButtonTextColor: '#2C7CBF',
        modalMainButtonColor: '#4285F4',
        modalMainButtonTextColor: '#FFF',
      },
      language: {
        current: 'es',
        locale: {
          es: {
            barMainText: 'Usamos cookies y otras técnicas de rastreo para mejorar tu experiencia de navegación en nuestra web, para mostrarte contenidos personalizados y anuncios adecuados, para analizar el tráfico en nuestra web y para comprender de dónde llegan nuestros visitantes.',
            barLinkSetting: 'Configurar Cookies',
            barBtnAcceptAll: 'Aceptar todas las Cookies',
            modalMainTitle: 'Configuracion de cookies',
            modalMainText: 'Las cookies son un pequeño conjunto de datos enviados desde un sitio web y almacenados en el ordenador del usuario por el navegador web del usuario mientras el usuario está navegando. Su navegador almacena cada mensaje en un pequeño archivo, llamado cookie. Cuando solicita otra página del servidor, su navegador envía la cookie de vuelta al servidor. Las cookies fueron diseñadas para ser un mecanismo confiable para que los sitios web recuerden información o registren la actividad de navegación del usuario.',
            modalCookiePolicyLinkText:'Política de cookies',
            modalBtnSave: 'Guardar configuración Actual',
            modalBtnAcceptAll: 'Aceptar todas las Cookies y cerrar',
            modalAffectedSolutions: 'Servicios Afectados:',
            learnMore: 'Saber mas en Política de Cookies',
            on: 'On',
            off: 'Off',
          },
          en: {
            barMainText: 'We use cookies and other tracking techniques to improve your browsing experience on our website, to show you personalized content and appropriate advertisements, to analyze traffic on our website and to understand where our visitors come from.',
            barLinkSetting: 'Cookie Settings',
            barBtnAcceptAll: 'Accept all cookies',
            modalMainTitle: 'Cookie settings',
            modalMainText: 'Cookies are small piece of data sent from a website and stored on the user\'s computer by the user\'s web browser while the user is browsing. Your browser stores each message in a small file, called cookie. When you request another page from the server, your browser sends the cookie back to the server. Cookies were designed to be a reliable mechanism for websites to remember information or to record the user\'s browsing activity.',
            modalCookiePolicyLinkText:'Cookie\'s Policy',
            modalBtnSave: 'Save current settings',
            modalBtnAcceptAll: 'Accept all cookies and close',
            modalAffectedSolutions: 'Affected solutions:',
            learnMore: 'Learn More',
            on: 'On',
            off: 'Off',
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
    console.log(window.CookieConsent.config, configObject, { ...window.CookieConsent.config, ...configObject });

    this.mergeDeep(window.CookieConsent.config, configObject)
    //loMerge(window.CookieConsent.config, configObject);
    // The cookie overrides the default and user config
    this.cookieToConfig();

    // We tell the world we did this
    Utilities.dispatchEvent(document, 'CCConfigSet');
  }

  cookieToConfig() {

    function removeReload() {
      Utilities.removeCookie();
      location.reload();
      return false;
    }

    document.cookie.split(';').filter((item) => {

      if (item.indexOf('cconsent') >= 0) {
        var cookieData = JSON.parse(item.split('=')[1]);

        // We check cookie version. If older we need to renew cookie.
        if (typeof cookieData.version === 'undefined') {
          return removeReload();
        } else {
          if (cookieData.version !== window.CookieConsent.config.cookieVersion) {
            return removeReload();
          }
        }

        // We check if cookie data categories also exist in user config
        for (let key in cookieData.categories) {

          // The cookie contains category not present in user config so we invalidate cookie
          if (typeof window.CookieConsent.config.categories[key] === 'undefined') {
            return removeReload();
          }
        }

        // We check if cookie data services also exist in user config
        cookieData.services.forEach(function (service) {

          // The cookie contains service not present in user config so we invalidate cookie
          if (typeof window.CookieConsent.config.services[service] === 'undefined') {
            return removeReload();
          }
        });

        // We we integrate cookie data into the global config object
        for (let key in cookieData.categories) {
          window.CookieConsent.config.categories[key].checked = window.CookieConsent.config.categories[key].wanted = (cookieData.categories[key].wanted === true) ? true : false;
        }

        window.CookieConsent.config.cookieExists = true;
        return true;
      }
    });

    return false;
  }


  // Simple object check.
  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  //Deep merge two objects.
  mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }
}
