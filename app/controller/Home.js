'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    * index() {
      const { ctx } = this;

      yield ctx.render('index.tpl');
    }
  }

  return HomeController;
};
