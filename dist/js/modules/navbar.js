export const nav = {

    btnToggler: document.querySelector('.navbar__toggler'),
    navbar: document.querySelector('.navbar'),


    startApp() {
        nav.collapse(nav.btnToggler, nav.navbar);
    },

    collapse: (element, target) => {
        element.addEventListener("click", () => {
            target.classList.toggle("collapsible--expanded");
        })
    },
}


