import { Admin } from './modules/adminUser.js';
import { Standard } from './modules/standardUser.js';
import { nav } from './modules/navbar.js'


// Global variable of Cloud FireStore.
var db = firebase.firestore();

//Start navbar collapse.
nav.startApp();

// Propierties and methods of application.
const app = {

    dataUser: {},

    // Initialize application.
    startApp() {
        this.logOut();
        this.userActive();
    },

    // Logout functionality.
    logOut() {

        let logOut = document.getElementById('log-out');

        if (logOut !== null) {
            logOut.addEventListener('click', () => {

                // Confirm log out.
                let outAccount = confirm('Do you want to log out?');

                if (outAccount) {
                    firebase.auth().signOut().then(() => {
                        // Sign-out successful.
                        console.log('sign-out succeddful');
                    }).catch((error) => {
                        // An error happened.
                        console.log(error);
                    });
                }

            });
        }
    },

    // Check if there is an active session.
    userActive() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // Get user data.
                app.getDataUser(user.uid);
            } else {
                // Redirect to login view.
                location.href = `../index.html`;
            }
        });
    },

    // Get data user from Cloud FireStore
    async getDataUser(credential) {

        let docRef = db.collection("users").doc(credential);

        await docRef.get().then((doc) => {
            if (doc.exists) {

                if (doc.data().userType === 'admin') {

                    // Create a user with the Admin class.
                    this.dataUser = new Admin(doc.data());

                }
                if (doc.data().userType === 'standard') {

                    this.dataUser = new Standard(doc.data());
                    // Create a user with the Standard class.
                }
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting data user:", error);
        });

    },
};

// Start application.
app.startApp();

