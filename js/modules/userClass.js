var db = firebase.firestore();

// Profile rendering function.
const getProfileHtml = function (user) {

    let badgeUser = '';
    let buttonsHtml = '';

    let blockUser = document.getElementById('block-user');

    if (user.userType === 'admin') {
        badgeUser = 'badge--admin';
        buttonsHtml = `<button id="btn-add-task" type="button" class="btn btn--large btn--primary">Add Task</button>
        <div id="user-add-task" class="user__add-task animated fadeIn fast">
                    <form id="form-add-task" action="">
                        <input id="task-title" class="form__input" type="text" placeholder="Task title">
                        <div class="form__group-select">
                            <label for="selectUserAssign" class="form__label">Assign to:</label>
                            <select id="task-assignedUser" name="selectUserAssign" class="form__input-select">
                                <option value="" disabled selected hidden>Select user</option>
                                ${user.coworkers.map(item => `
                                <option>${item}</option>`).join('')}
                            </select>
                        </div>
                        <textarea id="task-description" class="form__input" placeholder="Task description"></textarea>
                    </form>
                    <div class="btn--group">
                        <button id="add-task" class="btn btn--small btn--primary">Add</button>
                        <button id="cancel-task" class="btn btn--small btn--accent">Cancel</button>
                    </div>
                </div>
        <button id="view-task" type="button" class="btn btn--large btn--accent">View Task</button>`;
    }
    if (user.userType === 'standard') {
        badgeUser = 'badge--standard';
        buttonsHtml = `
        <button id="view-task" type="button" class="btn btn--large btn--accent">View Task</button>`
    }

    blockUser.innerHTML = `    <header class="block__header">
    <picture>
                    <source type="image/webp"
                        srcset="../images/resized/user.webp 1x, ../images/resized/user@2x.webp 2x" />
                    <source type="image/png" srcset="../images/resized/user.png 1x, ../images/resized/user@2x.png 2x" />
                    <img class="user__image" src="../images/resized/user.png" alt="User image" />
                </picture>
    <div class="user__name">
        <h3 class="text--primary">${user.name} ${user.lastname}</h3>
        <div class="badge ${badgeUser}">
            <p class="text--white">${user.userType}</p>
        </div>
    </div>
    <div class="user__company">
        <h3 class="text--accent">${user.company}</h3>
    </div>
</header>
<div class="user__coworkers">
    <p class="text--dark text--label">Coworkers:</p>
    <ul class="list">${user.coworkers.map(item => `
    <li>${item}: <br><span class="credential">${this.coworkerEmails[item]}</span></li>`).join('')}
    </ul>
</div>
${buttonsHtml}`
};

// Tasks rendering function.
const getTaskHtml = function () {

    let blockTask = document.getElementById('block-task');

    blockTask.innerHTML = `<P class="text--dark text--label">To do:</P>
    ${this.task.map(item => `
    <div class="task__card">
        <div class="task__header">
            <p class="text--white">${item.taskTitle}</p>
            <svg class="task__icon">
  <use href="../images/sprite.svg#times"></use>
</svg>
        </div>
        <div class="task__body">
            <p class="task__description">${item.taskDescription}</p>
            ${item.assignedUsers.map(assignedUser => `
            <p class="credential">${this.coworkerNames[assignedUser]}</p>`).join('')}
        </div>
    </div>
    `).join('')}`
};

const clearTaskHtml = function () {

    let blockTask = document.getElementById('block-task');

    this.task = [];
    blockTask.innerHTML = '';
};


// Super user class.
export class User {
    constructor(data) {

        this.name = data.name;
        this.lastname = data.lastname;
        this.email = data.email;
        this.company = data.company;
        this.userType = data.userType;
        this.userCredential = data.userCredential;
        // this.coworkers = {
        //     names = {},
        //     credentials = {},
        //     emails = {},
        // };
        this.coworkers = [];
        this.coworkerCredentials = {};
        this.coworkerNames = {};
        this.coworkerEmails = {};
        this.task = [];

        this.getCoworkers();
    }

    // Get coworkers of user.
    async getCoworkers() {

        // Add the username as the first coworker.
        this.coworkerNames[this.userCredential] = `${this.name} ${this.lastname}`;

        // Consult the database for the credentials of users in the same company.
        await db.collection("users").where("company", "==", this.company)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    let coworker = `${doc.data().name} ${doc.data().lastname}`;

                    if (coworker !== `${this.name} ${this.lastname}`) {
                        this.coworkers.push(coworker);
                        this.coworkerCredentials[coworker] = doc.data().userCredential;
                        this.coworkerNames[doc.data().userCredential] = coworker;
                        this.coworkerEmails[coworker] = doc.data().email;

                    }
                });

                // Rendering profile.
                this.renderProfileHtml(this);

                // Add functionality to rendered buttons.
                let self = this;

                if (this.userType === 'admin') {
                    let btnAddTask = document.getElementById('btn-add-task');
                    let btnAdd = document.getElementById('add-task');
                    let btnCancel = document.getElementById('cancel-task');

                    btnCancel.addEventListener('click', this.closeAddTask);
                    btnAddTask.addEventListener('click', this.showAddTask);
                    btnAdd.addEventListener('click', () => {
                        this.addTask(self);
                    })

                }

                let btnViewTask = document.getElementById('view-task');

                btnViewTask.addEventListener('click', () => {
                    this.viewTask(self);
                });


            })
            .catch((error) => {
                console.log("Error getting coworkers: ", error);
            });
    }

    // Render the profile view.
    get renderProfileHtml() {
        return getProfileHtml;
    }

    // Render the task view.
    get renderTask() {
        return getTaskHtml;
    }

    get clearTask() {
        return clearTaskHtml;
    }
};