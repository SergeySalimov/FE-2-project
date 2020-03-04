import {CONFIG} from "@/js/config";
import {EventEmitter} from "@/js/event-emitter";

const compiledTemplate = require('./template.handlebars');

export class Ui extends EventEmitter {
  constructor(model, router) {
    super();
    this._model = model;
    this.router = router;
    this.templateScript = compiledTemplate;
    this.initNavBtn();
    this.initCatBtn();
    // display routes functions
    this.renderPath = {
      '': this.displayHomePage.bind(this),
      '404': this.displayErrorPage.bind(this),
      'catalog': this.displayCatalogPage.bind(this),
      'how-to-buy': this.displayHowToBuyPage.bind(this),
      'delivery': this.displayDeliveryPage.bind(this),
      'payment': this.displayPaymentPage.bind(this),
      'contact': this.displayContactPage.bind(this),
    };

    this._model.on('productsLoaded', data => this.renderProductsToDisplay(data));
    this.on('pageChange', (page) => {
      this.hideAll();
      $(CONFIG.elements.nav2).children().slice(1).remove();
      this.renderPath[page]();
    });

  }

  isRouteOfCatalog(route) {
    return Object.keys(this._model.catalogRoutes).includes(route);
  }

  // output block
  displayCatalogPage() {
    const productToDisplay = window.location.pathname.trim();
    if (this.isRouteOfCatalog(productToDisplay))  {
      this.clearActiveCatalogNavigation();
      if (productToDisplay === '/catalog') {
        CONFIG.elements.catBtnHome.classList.add(CONFIG.active);
      } else {
        console.log('find of name');
        let name = '';
        for (const key in this._model.catalogNames) {
          if (this._model.catalogNames[key] === productToDisplay) name = key;
        }
        CONFIG.elements.catBtn.querySelectorAll('.list-group-item').forEach(e => {
          if (e.innerText === name) e.classList.add(CONFIG.active);
        });
      }
      // rerender Products
      this.renderProductsToDisplay(this._model.catalogRoutes[productToDisplay]);
      CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Каталог'));
      CONFIG.elements.catalogPage.classList.remove(CONFIG.dNone);
      CONFIG.elements.navBtnCatalog.classList.add(CONFIG.active);
    } else {
      this.render404()
    }
  }

  displayHomePage() {
    CONFIG.elements.homePage.classList.remove(CONFIG.dNone);
  }
  displayErrorPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Указанная страница не найдена'));
    CONFIG.elements.errorPage.classList.remove(CONFIG.dNone);
  }
  displayHowToBuyPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Как купить'));
    CONFIG.elements.howToBuyPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnHowToBuy.classList.add(CONFIG.active);
  }
  displayDeliveryPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Доставка'));
    CONFIG.elements.deliveryPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnDelivery.classList.add(CONFIG.active);
  }
  displayPaymentPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Оплата'));
    CONFIG.elements.paymentPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnPayment.classList.add(CONFIG.active);
  }
  displayContactPage() {
    CONFIG.elements.nav2Home.after(this.createHtmlForBreadcrump('Контакты'));
    CONFIG.elements.contactPage.classList.remove(CONFIG.dNone);
    CONFIG.elements.navBtnContact.classList.add(CONFIG.active);
  }
  createHtmlForBreadcrump(description, active = true) {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    if (active) {
      li.classList.add(CONFIG.active);
      li.innerText = description;
    } else {
      li.innerHTML = `<a href="#">${description}</a>`;
    }
    return li;
  }
  hideAll() {
    CONFIG.elements.homePage.classList.add(CONFIG.dNone);
    CONFIG.elements.errorPage.classList.add(CONFIG.dNone);
    CONFIG.elements.catalogPage.classList.add(CONFIG.dNone);
    CONFIG.elements.howToBuyPage.classList.add(CONFIG.dNone);
    CONFIG.elements.deliveryPage.classList.add(CONFIG.dNone);
    CONFIG.elements.paymentPage.classList.add(CONFIG.dNone);
    CONFIG.elements.contactPage.classList.add(CONFIG.dNone);
    CONFIG.elements.navBtnCatalog.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnHowToBuy.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnDelivery.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnPayment.classList.remove(CONFIG.active);
    CONFIG.elements.navBtnContact.classList.remove(CONFIG.active);
  }
  render404() {
    window.history.pushState(null, null, '/404');
    this.router.render(decodeURI(window.location.pathname));
  }
  // initialization block
  initCatBtn() {
    CONFIG.elements.catBtnHome.addEventListener('click', (event) => {
      this.emit('catClick', '/catalog');
    });
    CONFIG.elements.catBtn.addEventListener('click', (event) => {
      if (event.target !== CONFIG.elements.catBtn && event.target !== CONFIG.elements.catBtnHome) {
        this.emit('catClick', this._model.catalogNames[event.target.innerText]);
      }
    });
  }

  clearActiveCatalogNavigation() {
    CONFIG.elements.catBtn.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
  }

  initNavBtn() {
    CONFIG.elements.navBtnCatalog.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/catalog');
    });
    CONFIG.elements.navBtnHowToBuy.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/how-to-buy');
    });
    CONFIG.elements.navBtnDelivery.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/delivery');
    });
    CONFIG.elements.navBtnPayment.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/payment');
    });
    CONFIG.elements.navBtnContact.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/contact');
    });
    CONFIG.elements.nav2Home.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
    CONFIG.elements.errorBack.addEventListener('click', (event) => {
      event.preventDefault();
      this.emit('navClick', '/');
    });
  }
  // rendering templates
  renderProductsToDisplay(data) {
    // compile with handlebars
    CONFIG.elements.productsPlace.innerHTML = this.templateScript(data)

  }
}

