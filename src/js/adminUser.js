import { User } from './userClass.js';

// Global variable of Cloud FireStore.
var db = firebase.firestore();


export class Admin extends User {
    
    showAddTask() {
        let blockAddTask = document.getElementById('user-add-task');
        blockAddTask.classList.toggle('show');
    }

    closeAddTask() {
        let blockAddTask = document.getElementById('user-add-task');
        blockAddTask.classList.remove('show');
    }

    addTask(user) {
        let taskTitle = document.getElementById('task-title').value;
        let taskDescription = document.getElementById('task-description').value;
        let assignUser = document.getElementById('task-assignedUser').value;
        let formAddTask = document.getElementById('form-add-task');

        if (![taskTitle, taskDescription, assignUser].includes('')) {

            db.collection(user.company).doc(taskTitle).update({
                assignedUsers: firebase.firestore.FieldValue.arrayUnion(user.coworkerCredentials[assignUser])
            }).then(() => {
                console.log('Task update');
                formAddTask.reset();
                user.closeAddTask();
                user.viewTask(user);
            }).catch((error) => {
                db.collection(user.company).doc(taskTitle).set({
                    assignedUsers: [user.coworkerCredentials[assignUser]],
                    taskDescription: taskDescription,
                }).then(() => {
                    console.log('New task added');
                    formAddTask.reset();
                    user.closeAddTask();
                    user.viewTask(user);

                }).catch((error) => {
                    console.log(error);
                });
                console.log(error);
            });
        };
    }

    viewTask(user) {
        
        // Clean and update task frame.
        user.clearTask(user);
        
        // Get tasks from Cloud Firestore.
        db.collection(user.company).get().then((querySnapshot) => {
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
            icon.addEventListener('click',function(){
                user.deleteTask(user, this);
            })
            // app.listenerNotNull(icon, 'click', user.deleteTask);
        })

    }

    // Delete task.
    deleteTask(user, icon) {
        
        // Get task id.
        let idTask = icon.parentNode.innerText;
        
        // Delete task with specific id.
        db.collection(user.company).doc(idTask).delete().then(() => {
            user.viewTask(user);
            console.log("Task successfully deleted!");
        }).catch((error) => {
            console.error("Error removing task: ", error);
        });
    }

    
}