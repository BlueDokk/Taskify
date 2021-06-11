import { User } from './userClass.js';

// Global variable of Cloud FireStore.
var db = firebase.firestore();


export class Standard extends User {


    viewTask(user) {

        // Clean and update task frame.
        user.clearTask(user);

        // Get tasks from Cloud Firestore.
        db.collection(user.company).where("assignedUsers", "array-contains", user.userCredential)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // Add data to the task matrix.
                    user.task.push({ ...doc.data(), taskTitle: doc.id });

                });

                // Insert task HTML into frame.
                let blockTask = document.getElementById('block-task');

                if (blockTask.innerText == "") {
                    user.renderTask(user);
                    user.getIconsTask(user);
                }
            });

    }

    // Functionality for delete tasks icons.
    getIconsTask(user) {
        let iconsDelete = document.querySelectorAll('.task__icon');

        iconsDelete.forEach(icon => {
            icon.addEventListener('click', function () {
                user.deleteTask(user, this);
            })
        })

    }

    // Delete task.
    deleteTask(user, icon) {

        // Get task id.
        let idTask = icon.parentNode.innerText;

        // Get the users assigned to that task.
        db.collection(user.company).doc(idTask)
            .get()
            .then((doc) => {

                // Delete usuario of specific task.
                let assignedUsers = doc.data().assignedUsers;
                let indexUser = assignedUsers.indexOf(user.userCredential)
                assignedUsers.splice(indexUser, 1);

                db.collection(user.company).doc(idTask).update({
                    assignedUsers: firebase.firestore.FieldValue.delete()
                }).then(() => {
                    console.log('Field deleted');
                    user.viewTask(user);

                    // Update the users assigned to that task.
                    db.collection(user.company).doc(idTask).update({
                        assignedUsers: assignedUsers
                    });
                    console.log("Task successfully deleted!");

                }).catch((error) => {
                    console.log(error);
                });


            }).catch((error) => {
                console.log("Error removing task: ", error);
            });
    }

}

