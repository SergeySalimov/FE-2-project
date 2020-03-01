export class Router {
  constructor() {
    this.routes = {
      '404': () => console.log('Nothing found'),
    };

    window.addEventListener('popstate', () => {
      this.render(decodeURI(window.location.pathname));
    });
  }

  addRoute(route, action) {
    this.routes[route] = action;
  }

  render(url) {
    console.log(url);
    const temp = url.split('/')[1];
    console.log('temp :' + temp);
    // eslint-disable-next-line no-unused-expressions
    this.routes[temp] ? this.routes[temp]() : this.routes['404']();
  }
}
