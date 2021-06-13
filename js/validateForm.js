var db = firebase.firestore();

const dataForm = {

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
		password: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/,
	},

	startForm() {

		this.userActive();
		// Initialize reading fields in the form.
		this.readFields();
		this.iconPassword.addEventListener('click', this.showPassword);
		this.listenerNotNull(this.form, 'submit', this.validateForm);

	},

	validateField(expresion, input, field) {

		// Get elements of input groups.
		let formGroup = document.getElementById(`group-${field}`);
		let formIcon = document.querySelector(`#group-${field} #icon-${field}`);
		let formMessage = document.querySelector(`#error-${field} p`);
		let errorMessage = document.getElementById('error-message');

		if ((formGroup !== null) && (formIcon !== null) && (formMessage !== null) && (errorMessage !== null)) {

			if (expresion.test(input.value)) {

				// Add class correct on input group.
				formGroup.classList.remove('form__group-incorrect');
				formGroup.classList.add('form__group-correct');
				formMessage.classList.remove('form__input-error-active');

				if (window.location.href.includes('account')) {
					formIcon.setAttribute('href', '../images/sprite.svg#check');
				} else {
					formIcon.setAttribute('href', './images/sprite.svg#check');
				}

				// Add validation result.
				this.fields[field] = true;

				// Show or hidden error message.
				if (Object.values(this.fields).includes(false)) {
					errorMessage.style.display = 'block';
				} else {
					errorMessage.style.display = 'none';
				}
			} else {

				// Add class incorrect on input group.
				formGroup.classList.add('form__group-incorrect');
				formGroup.classList.remove('form__group-correct');
				formMessage.classList.add('form__input-error-active');
				errorMessage.style.display = 'block';

				if (window.location.href.includes('account')) {
					formIcon.setAttribute('href', '../images/sprite.svg#error');
				} else {
					formIcon.setAttribute('href', './images/sprite.svg#error');
				}

				this.fields[field] = false;
			}
		}
	},

	validateFields(e) {

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
				if (e.target.value) { dataForm.fields[e.target.id] = true };
				break;
			case 'user-type':
				if (e.target.value) { dataForm.fields[e.target.id] = true };
				break;
		}
	},

	// Form submit function
	validateForm(e) {

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

	readFields() {

		// Constant reading of fields.
		let inputsText = document.querySelectorAll('.form__input');
		let inputsSelect = document.querySelectorAll('.form__input-select');

		// Reading text input.
		inputsText.forEach(input => {
			input.addEventListener('keyup', this.validateFields);
			input.addEventListener('blur', this.validateFields);
		});

		// Reading select input.
		inputsSelect.forEach(input => {
			input.addEventListener('click', this.validateFields);
		});
	},

	resetFields(form) {

		let formInputsGroup = document.querySelectorAll('.form__group-input');

		// Reset inputs styles.
		formInputsGroup.forEach((group) => {
			group.classList.remove('form__group-incorrect');
			group.classList.remove('form__group-correct');
		})

		// Reset form.
		form.reset();
	},

	showPassword() {

		let inputPassword = document.getElementById('password');
		let iconPassword = document.getElementById('password-icon');

		if (inputPassword.type === 'password') {
			inputPassword.type = 'text';
			iconPassword.setAttribute('href', './images/sprite.svg#eye-slash');

		} else {
			inputPassword.type = 'password';
			iconPassword.setAttribute('href', './images/sprite.svg#eye');

		}
	},

	userActive() {
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				// Redirect to user view.
				if (window.origin.includes('github.io')) {
					location.href = `${window.origin}/Taskify/pages/user.html`;
				} else {
					location.href = `../pages/user.html`;
				}
			}
		});
	},

	// Create account in firebase authentication.
	createNewAccount() {

		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;

		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in

				user.userCredential = userCredential.user.uid;
				dataForm.sendData();
				dataForm.resetFields(dataForm.form);
				alert('Successful registration');

			})
			.catch((error) => {
				dataForm.resetFields(dataForm.form);
				var errorCode = error.code;
				var errorMessage = error.message;
				alert('Unsuccessful registration')
				console.log(error);
			});
	},

	// Validate account in Firebase Authentication
	authenticationAccount() {

		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				// Signed in
				user.userCredential = userCredential.user.uid;
				dataForm.resetFields(dataForm.form);

				if (window.origin.includes('github.io')) {
					location.href = `${window.origin}/Taskify/pages/user.html`;
				} else {
					location.href = `../pages/user.html`;
				}

			})
			.catch((error) => {
				alert('User does not exist');
				dataForm.resetFields(dataForm.form);
				var errorCode = error.code;
				var errorMessage = error.message;
			});

	},

	// Send user information to Cloud Firestore
	async sendData() {

		dataForm.readUser();
		console.log(user);

		await db.collection("users").doc(user.userCredential).set(user)
			.then(() => {
				console.log("Document successfully written!");
				location.href = `${window.origin}/pages/user.html`;
			})
			.catch((error) => {
				console.error("Error writing document: ", error);
			});
	},

	// Get validated user information.
	readUser() {
		user.name = document.getElementById('name').value;
		user.lastname = document.getElementById('lastname').value;
		user.email = document.getElementById('email').value;
		user.company = document.getElementById('company').value;
		user.userType = document.getElementById('user-type').value;
	},

	// Avoid events on null elements.
	listenerNotNull(element, event, method) {

		if (element !== null) {
			element.addEventListener(event, method);
		}
	}


}

// User information validated.
const user = {
	name: '',
	lastname: '',
	email: '',
	company: '',
	userType: '',
	userCredential: '',
}

// Initialize initial methods of the form.
dataForm.startForm()





