/*
Hide header on scroll down & show on scroll up
*/

const header = document.getElementById('header');
let lastPos = document.documentElement.scrollTop;

window.addEventListener('scroll', () => {
  const currPos = document.documentElement.scrollTop;

  if (currPos > lastPos) {
    if (currPos > header.offsetHeight) {
      header.classList.add('-translate-y-full');
      header.classList.remove('header-shadow');
    }
  } else {
    header.classList.remove('-translate-y-full');
    header.classList.add('header-shadow');
  }

  lastPos = currPos;
}, false);

/*
Toggle the menu when pressed on hamburger button
Only on mobile devices
*/

const menu = document.getElementById('menu');
const searchBox = document.getElementById('search');
const menuToggle = document.getElementById('menu-toggle');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
  searchBox.classList.toggle('hidden');
}, false);

/*
Lazy load images
*/

const lazyImages = document.getElementsByClassName('lazy');

document.addEventListener('DOMContentLoaded', () => {
  [...lazyImages].forEach((elem) => {
    const originalImage = elem.dataset.src;

    elem.setAttribute('src', originalImage);
    elem.removeAttribute('data-src');
  });
  if (localStorage.current === 'dark' || (!'current' in localStorage && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.querySelector('html').classList.add('dark')
  } else {
  if (localStorage.current === 'dark') {
    document.querySelector('html').classList.add('dark')
  }
    else {
      document.querySelector('html').classList.remove('dark')
    }
  }
}, false);

function activateDarkMode() {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
if ((localStorage.theme === 'dark')) {
  document.querySelector('html').classList.add('dark')
  localStorage.theme = 'light'
  localStorage.current = 'dark'
} else {
  document.querySelector('html').classList.remove('dark')
  localStorage.theme = 'dark'
  localStorage.current = 'light'
}
}
