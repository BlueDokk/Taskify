// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"DZXM":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var db = firebase.firestore();
var dataForm = {
  form: document.querySelector('form'),
  iconPassword: document.getElementById('show-password'),
  btnRegister: document.getElementById('register'),
  btnLogin: document.getElementById('login'),
  // Array with validation results. 
  fields: [],
  // Regular expressions for validate fields in the form.
  expressions: {
    name: /^[a-zA-ZÀ-ÿ\s]{3,40}$/,
    lastname: /^[a-zA-ZÀ-ÿ\s]{3,40}$/,
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/
  },
  startForm: function startForm() {
    // Initialize reading fields in the form.
    this.readFields();
    this.iconPassword.addEventListener('click', this.showPassword);
    this.listenerNotNull(this.form, 'submit', this.validateForm);
  },
  validateField: function validateField(expresion, input, field) {
    // Get elements of input groups.
    var formGroup = document.getElementById("group-".concat(field));
    var formIcon = document.querySelector("#group-".concat(field, " .form__validation-state"));
    var formMessage = document.querySelector("#error-".concat(field, " p"));
    var errorMessage = document.getElementById('error-message');

    if (formGroup !== null && formIcon !== null && formMessage !== null && errorMessage !== null) {
      if (expresion.test(input.value)) {
        // Add class correct on input group.
        formGroup.classList.remove('form__group-incorrect');
        formGroup.classList.add('form__group-correct');
        formIcon.classList.remove('fa-times-circle');
        formIcon.classList.add('fa-check-circle');
        formMessage.classList.remove('form__input-error-active'); // Add validation result.

        this.fields[field] = true; // Show or hidden error message.

        if (Object.values(this.fields).includes(false)) {
          errorMessage.style.display = 'block';
        } else {
          errorMessage.style.display = 'none';
        }
      } else {
        // Add class incorrect on input group.
        formGroup.classList.add('form__group-incorrect');
        formGroup.classList.remove('form__group-correct');
        formIcon.classList.add('fa-times-circle');
        formIcon.classList.remove('fa-check-circle');
        formMessage.classList.add('form__input-error-active');
        errorMessage.style.display = 'block';
        this.fields[field] = false;
      }
    }
  },
  validateFields: function validateFields(e) {
    // Custom validation for each field.
    switch (e.target.id) {
      case 'name':
        dataForm.validateField(dataForm.expressions.name, e.target, e.target.id);
        break;

      case 'lastname':
        dataForm.validateField(dataForm.expressions.lastname, e.target, e.target.id);
        break;

      case 'email':
        dataForm.validateField(dataForm.expressions.email, e.target, e.target.id);
        break;

      case 'password':
        dataForm.validateField(dataForm.expressions.password, e.target, e.target.id);
        break;

      case 'company':
        if (e.target.value) {
          dataForm.fields[e.target.id] = true;
        }

        ;
        break;

      case 'user-type':
        if (e.target.value) {
          dataForm.fields[e.target.id] = true;
        }

        ;
        break;
    }
  },
  // Form submit function
  validateForm: function validateForm(e) {
    e.preventDefault();

    if (dataForm.form.id === "register-form") {
      if (Object.keys(dataForm.fields).length === 6) {
        if (!dataForm.fields.includes(false)) {
          // Create account.
          dataForm.createNewAccount();
        } else {
          alert("Error: Invalid information. Please fill in the form correctly.");
          return false;
        }
      } else {
        alert("Error: Incomplete form. Please fill in the form correctly.");
        return false;
      }
    }

    if (dataForm.form.id === "login-form") {
      if (Object.keys(dataForm.fields).length === 2) {
        if (!dataForm.fields.includes(false)) {
          // Create account.
          dataForm.authenticationAccount();
        } else {
          alert("Error: Invalid information. Please fill in the form correctly.");
          return false;
        }
      } else {
        alert("Error: Incomplete form. Please fill in the form correctly.");
        return false;
      }
    }
  },
  readFields: function readFields() {
    var _this = this;

    // Constant reading of fields.
    var inputsText = document.querySelectorAll('.form__input');
    var inputsSelect = document.querySelectorAll('.form__input-select'); // Reading text input.

    inputsText.forEach(function (input) {
      input.addEventListener('keyup', _this.validateFields);
      input.addEventListener('blur', _this.validateFields);
    }); // Reading select input.

    inputsSelect.forEach(function (input) {
      input.addEventListener('click', _this.validateFields);
    });
  },
  resetFields: function resetFields(form) {
    var formInputsGroup = document.querySelectorAll('.form__group-input'); // Reset inputs styles.

    formInputsGroup.forEach(function (group) {
      group.classList.remove('form__group-incorrect');
      group.classList.remove('form__group-correct');
    }); // Reset form.

    form.reset();
  },
  showPassword: function showPassword() {
    var inputPassword = document.getElementById('password');
    var iconPassword = document.getElementById('password-icon');

    if (inputPassword.type === 'password') {
      inputPassword.type = 'text';
      console.log(this);
      iconPassword.setAttribute('href', './images/sprite.svg#eye-slash');
    } else {
      inputPassword.type = 'password';
      iconPassword.setAttribute('href', './images/sprite.svg#eye');
    }
  },
  // Create account in firebase authentication.
  createNewAccount: function createNewAccount() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userCredential) {
      // Signed in
      user.userCredential = userCredential.user.uid;
      dataForm.sendData();
      dataForm.resetFields(dataForm.form);
      alert('Successful registration');
    }).catch(function (error) {
      dataForm.resetFields(dataForm.form);
      var errorCode = error.code;
      var errorMessage = error.message;
      alert('Unsuccessful registration');
      console.log(error);
    });
  },
  // Validate account in Firebase Authentication
  authenticationAccount: function authenticationAccount() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function (userCredential) {
      // Signed in
      user.userCredential = userCredential.user.uid;
      dataForm.resetFields(dataForm.form);

      if (window.origin.includes('github.io')) {
        location.href = "".concat(window.origin, "/Taskify/pages/user.html");
      } else {
        location.href = "".concat(window.origin, "/pages/user.html");
      }
    }).catch(function (error) {
      alert('User does not exist');
      dataForm.resetFields(dataForm.form);
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  },
  // Send user information to Cloud Firestore
  sendData: function sendData() {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              dataForm.readUser();
              console.log(user);
              _context.next = 4;
              return db.collection("users").doc(user.userCredential).set(user).then(function () {
                console.log("Document successfully written!");
                location.href = "".concat(window.origin, "/pages/user.html");
              }).catch(function (error) {
                console.error("Error writing document: ", error);
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  // Get validated user information.
  readUser: function readUser() {
    user.name = document.getElementById('name').value;
    user.lastname = document.getElementById('lastname').value;
    user.email = document.getElementById('email').value;
    user.company = document.getElementById('company').value;
    user.userType = document.getElementById('user-type').value;
  },
  // Avoid events on null elements.
  listenerNotNull: function listenerNotNull(element, event, method) {
    if (element !== null) {
      element.addEventListener(event, method);
    }
  }
}; // User information validated.

var user = {
  name: '',
  lastname: '',
  email: '',
  company: '',
  userType: '',
  userCredential: ''
}; // Initialize initial methods of the form.

dataForm.startForm();
},{}]},{},["DZXM"], null)
//# sourceMappingURL=/validateForm.8b68de07.js.map