var navMain = document.querySelector('.nav');
var navToggle = document.querySelector('.nav__toggle');

navToggle.addEventListener('click', function() {
if (navMain.classList.contains('nav--open')) {
navMain.classList.remove('nav--open');
} else {
navMain.classList.add('nav--open');
}
});
