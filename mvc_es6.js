/**
 Model Controller
 Properties:
 - model
 - url
 */
class MC {
  httpDelete(resolve = () => {}, reject = () => {}) {
    this.model = {
      id: this.model.id,
      __Status: 'DEL'
    }
    this.httpPatch(resolve, reject);
  }
  httpGet(id, resolve = () => {}, reject = () => {}) {
    $.ajax(`${this.url}('${id}')`, {
      error: (jqXHR, textStatus, errorThrown) => {
        reject(jqXHR, textStatus, errorThrown);
      },
      method: 'GET',
      success: (data, textStatus, jqXHR) => {
        resolve(data, textStatus, jqXHR);
      }
    });
  }
  httpPatch(resolve = () => {}, reject = () => {}) {
    $.ajax(`${this.url}('${this.model.id}')`, {
      data: JSON.stringify(this.model),
      error: (jqXHR, textStatus, errorThrown) => {
        reject(jqXHR, textStatus, errorThrown);
      },
      method: 'PATCH',
      success: (data, textStatus, jqXHR) => {
        resolve(data, textStatus, jqXHR);
      }
    });
  }
  httpPost(resolve = () => {}, reject = () => {}) {
    this.model.id = null;
    $.ajax(this.url, {
      data: JSON.stringify(this.model),
      error: (jqXHR, textStatus, errorThrown) => {
        reject(jqXHR, textStatus, errorThrown);
      },
      method: 'POST',
      success: (data, textStatus, jqXHR) => {
        this._model.id = jqXHR.getResponseHeader('OData-EntityID');
        resolve(data, textStatus, jqXHR);
      }
    });
  }
  httpPut(resolve = () => {}, reject = () => {}) {
    $.ajax(`${this.url}('${this.model.id}')`, {
      data: JSON.stringify(this.model),
      error: (jqXHR, textStatus, errorThrown) => {
        reject(jqXHR, textStatus, errorThrown);
      },
      method: 'PUT',
      success: (data, textStatus, jqXHR) => {
        resolve(data, textStatus, jqXHR);
      }
    });
  }
}

/**
 CotModel Model Controller
 Property:
 - cotModel
 */
class CotModelMC extends MC {
  httpDelete(resolve = () => {}, reject = () => {}) {
    this.model = this.cotModel.toJSON();
    super.httpDelete(resolve, reject);
  }
  httpGet(id, resolve = () => {}, reject = () => {}) {
    super.httpGet(id, (data, textStatus, jqXHR) => {
      this._cotModel.set(this.model);
      resolve(data, textStatus, jqXHR);
    }, reject);
  }
  httpPatch(resolve = () => {}, reject = () => {}) {
    this.model = this.cotModel.toJSON();
    super.httpPatch(resolve, reject);
  }
  httpPost(resolve = () => {}, reject = () => {}) {
    this.model = this.cotModel.toJSON();
    super.httpPost((data, textStatus, jqXHR) => {
      this.cotModel.set('id', this.model.id);
      resolve(data, textStatus, jqXHR);
    }, reject);
  }
  httpPut(resolve = () => {}, reject = () => {}) {
    this.model = this.cotModel.toJSON();
    super.httpPut(resolve, reject);
  }
}

/**
 View Controller
 Property:
 - $view
 */
class VC {
  hide(resolve = () => {}, reject = () => {}) {
    if (this.$view != null) {
      this.$view.findOut(400, resolve);
    } else {
      resolve();
    }
  }
  remove(resolve = () => {}, reject = () => {}) {
    resolve();
  }
  render(resolve = () => {}, reject = () => {}) {

    // STEP 2
    const step2 = () => {
      this.render_always(resolve, reject);
    };

    // STEP 1
    const step1 = () => {
      if (this.renderedOnce != true) {
        this.renderedOnce = true;
        this.render_once(step2, reject)
      } else {
        step2();
      }
    };

    // START
    step1();
  }
  render_always(resolve = () => {}, reject = () => {}) {
    resolve();
  }
  render_once(resolve = () => {}, reject = () => {}) {
    resolve();
  }
  show(resolve = () => {}, reject = () => {}) {
    if (this.$view != null) {
      this.$view.fadeIn(400, resolve);
    } else {
      resolve();
    }
  }
}

/**
 Navigation View Controller
 Property:
 - defaultVC
 - vcs
 */
class NavVC extends VC {
  closeVC(vc, resolve = () => {}, reject = () => {}) {

    // STEP 2
    const step2 = () => {
      if (this.vcs != null && this.vcs.length != 0) {
        const i = this.vcs.indexOf(vc);
        if (i != -1) {
          this.vcs.splice(i, 1);
        }
      }
      vc.remove(resolve, reject);
    };

    // STEP 1
    const step1 = () => {
      if (this.vcs != null && this.vcs.length != 0 && this.vcs[this.vcs.length - 1] === vc) {
        this.vcs.pop();
      }
      if (this.vcs.length == 0) {
        vc.hide(step2, reject);
      } else {
        const topVC = this.vcs.pop();
        this.vcs.push(vc, topVC);
        this.render(step2, reject);
      }
    };

    // START
    step1();
  }
  openVC(vc, resolve = () => {}, reject = () => {}) {
    if (this.vcs == null) {
      this.vcs = [];
    }
    const i = this.vcs.indexOf(vc);
    if (i != -1) {
      this.vcs.splice(i, 1);
    }
    this.vcs.push(vc);
    this.render(resolve, reject);
  }
  render_always(resolve = () => {}, reject = () => {}) {
    if (this.vcs == null || this.vcs.length == 0) {
      if (this.defaultVC.vc == null) {
        this.defaultVC.vc = new this.vcClasses[this.defaultVC.vcClass]();
        this.defaultVC.vc.options = this.defaultVC.options;
      }
      this.openVC(this.defaultVC.vc, resolve, reject);
    } else {

      // STEP 2
      const step2 = () => {
        this.vcs[this.vcs.length - 1].show(resolve, reject);
      };

      // STEP 1
      const step1 = () => {
        if (this.vcs.length > 1) {
          this.vcs[this.vcs.length - 2].hide(step2, reject);
        } else {
          step2();
        }
      };

      // START
      step1();
    }
  }
}

class NavbarVC extends NavVC {
  render_always(resolve = () => {}, reject = () => {}) {
    this.$view.filter('.requireLogin').hide();
    this.render_always_login(() => {
      const renderMenu = (this.vcs != null && this.vcs.length > 0);
      super.render_always(() => {
        if (renderMenu) {
          this.render_always_menu(resolve, reject);
        } else {
          resolve();
        }
      }, reject);
    }, reject);
  }
  render_always_login(resolve = () => {}, reject = () => {}) {
    const $login = this.$view.find('.navbar-login').empty();
    if (this.cotLogin == null) {
      // No UI
    } else {
      if (this.cotLogin.isLoggedIn()) {
        $login.append(`
						<form class="navbar-form navbar-left">
							<p class="form-control-static">${this.cotLogin.username}</p>
							<button class="btn btn-default btn-logout" type="button">Logout</button>
						</form>
					`).find('.btn-logout').on('click', (e) => {
          e.preventDefault();
          this.cotLogin.logout();
        });
      } else {
        $login.append(`
						<form class="navbar-form navbar-left">
							<button class="btn btn-default btn-login" type="button">Login</button>
						</form>
					`).find('.btn-login').on('click', (e) => {
          e.preventDefault();
          this.cotLogin.showLogin();
        });
      }
    }
    resolve();
  }
  render_always_menu(resolve = () => {}, reject = () => {}) {
    const $menu = this.$view.find('.navbar-menu');
    $menu.html(`
			<ul class="nav navbar-nav">
				<li class="dropdown">
					<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Navigation <span class="caret"></span></a>
					<ul class="dropdown-menu">
					</ul>
				</li>
			</ul>
		`);

    const $dropDownMenu = $menu.find('ul.dropdown-menu');

    if (this.menu != null) {
      for (const menu of this.menu) {
        const $menuItem = $(`<li><a href="#">${menu.title}</a></li>`);
        $dropDownMenu.append($menuItem);
        $menuItem.find('a').on('click', (e) => {
          e.preventDefault();
          console.log('MENU CLICK');
          console.log('MENU VC', menu.vc);
          if (menu.vc == null) {
            menu.vc = new this.vcClasses[menu.vcClass]();
            menu.vc.options = menu.vcOptions;
          }
          this.openVC(menu.vc);
        });
      }
    }

    const vcs = this.vcs.filter((vc) => vc.title != null);

    if (this.menu != null & this.menu.length > 0 && vcs != null && vcs.length > 0) {
      $dropDownMenu.append($('<li role="separator" class="divider"></li>'));
    }

    if (vcs != null) {
      for (const vc of vcs) {
        const $menuItem = $(`<li><a href="#">${vc.title || 'Untitled'}</a></li>`);
        $dropDownMenu.append($menuItem);
        $menuItem.find('a').on('click', (e) => {
          e.preventDefault();
          this.openVC(vc);
        });
      }
    }

    resolve();
  }
  render_once(resolve = () => {}, reject = () => {}) {
    super.render_once(() => {
      if (this.cotLogin != null) {
        this.cotLogin.options.onLogin = () => {
          this.render();
        }
      }

      this.$view = $(`
  			<nav class="navbar navbar-default navvc">
  				<div class="container-fluid">
  					<div class="navbar-header">
  						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
  							<span class="sr-only">Toggle navigation</span>
  							<span class="icon-bar"></span>
  							<span class="icon-bar"></span>
  							<span class="icon-bar"></span>
  						</button>
  						<span class="navbar-brand"></span>
  					</div>
  					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
  						<div class="navbar-left">
  							<div class="navbar-vc-ui"></div>
  						</div>
  						<div class="navbar-right">
  							<div class="nav navbar-nav navbar-menu"></div>
  							<div class="nav navbar-nav navbar-login"></div>
  							<div class="nav navbar-nav navbar-lock"></div>
  						</div>
  					</div>
  				</div>
  			</nav>
  			<div class="requireLogin">
  				<p>Please login.</p>
  			</div>
  		`);
      $('.navbar-lock', this.$view.filter('.navbar')).append($('.securesite > img'));
      $('#app-content-top').append(this.$view);

      resolve();
    }, reject);
  }
}
