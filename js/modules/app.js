var db = firebase.firestore();

export const app = {

    dataUser: {},
    logOut: document.getElementById('log-out'),
    blockUser: document.getElementById('block-user'),
    blockTask: document.getElementById('block-task'),
    btnAddTask: document.getElementById('btn-add-task'),
    task: [],

    startApp() {
        this.getUser();
        this.listenerNotNull(this.logOut, 'click', (e) => {
            e.preventDefault();
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
    },

    getUser() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                app.getDataUser(user.uid);
            } else {
                // No user is signed in.
                if (window.origin.includes('github.io')) {
                    location.href = `${window.origin}/Taskify`;
                } else {
                    location.href = `${window.origin}`;
                }
            }
        });
    },

    async getDataUser(credential) {

        let docRef = db.collection("users").doc(credential);

        await docRef.get().then((doc) => {
            if (doc.exists) {

                if (doc.data().userType === 'admin') {
                    this.dataUser = new Admin(doc.data(), blockUser, blockTask);
                    this.dataUser.getCoworkers()
                }
                if (doc.data().userType === 'standard') {
                    this.dataUser = new Standard(doc.data(), blockUser, blockTask);
                    this.dataUser.getCoworkers()
                }

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    },

    resetFileds(form) {
        form.reset();
    },

    // Avoid events on null elements.
    listenerNotNull(element, event, method) {

        if (element !== null && element !== undefined) {
            element.addEventListener(event, method);
        }
    }
};