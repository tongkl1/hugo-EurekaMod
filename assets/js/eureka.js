//Masonry Layout
function enableMasonry() {
  window.onload = resizeAllGridItems();
  window.addEventListener('resize', resizeAllGridItems);
  var imgs = document.getElementsByTagName('img');
  for (let img of imgs) {
    imgLoad(img, resizeAllGridItems());
  }
}

function imgLoad(img) {
  var timer = setInterval(() => {
    if (img.complete) {
      resizeAllGridItems();
      clearInterval(timer);
    }
  }, 50);
}

function resizeGridItem(item) {
  grid = document.getElementsByClassName('masonry')[0];
  rowHeight = 0;
  rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  rowSpan = Math.ceil((item.querySelector('.grid-content').getBoundingClientRect().height) / rowGap);
  item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllGridItems() {
  allItems = document.getElementsByClassName('item');
  for (x = 0; x < allItems.length; x++) {
    resizeGridItem(allItems[x]);
  }
}

//color components/schema
function getColorScheme() {
  let element = document.getElementById('lightDarkMode');
  let targetDiv = document.getElementById('lightDarkOptions');
  let targets = targetDiv.getElementsByTagName('span');
  let screen = document.getElementById('is-open');

  element.addEventListener('click', () => {
    targetDiv.classList.toggle('hidden');
    screen.classList.toggle('hidden');
  });

  for (let target of targets) {
    target.addEventListener('click', () => {
      let targetName = target.getAttribute('name');
      let icon = switchMode(targetName);
      let old_icon = element.firstElementChild.getAttribute('data-icon');
      element.firstElementChild.setAttribute('data-icon', icon);
      element.firstElementChild.classList.remove('fa-' + old_icon);
      element.firstElementChild.classList.add('fa-' + icon);

      localStorage.setItem('lightDarkMode', targetName);

      targetDiv.classList.toggle('hidden');
      screen.classList.toggle('hidden');
    });
  }
  screen.addEventListener('click', () => {
    targetDiv.classList.toggle('hidden');
    screen.classList.toggle('hidden');
  })
}

function switchMode(mode) {
  let icon = ''
  switch (mode) {
    case 'Light':
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', switchDarkMode);
      icon = 'sun';
      document.querySelector('html').classList.remove('dark');
      break;
    case 'Dark':
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', switchDarkMode);
      icon = 'moon';
      document.querySelector('html').classList.add('dark');
      break;
    case 'Auto':
      icon = 'adjust';
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
      switchDarkMode(isDarkMode);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', switchDarkMode);
      break;
  }
  return icon;
}

function switchDarkMode(e) {
  if (e.matches) {
    document.querySelector('html').classList.add('dark');
  } else {
    document.querySelector('html').classList.remove('dark');
  }
}

//switch burger
function switchBurger() {
  let menuBtn = document.getElementById('navbar-btn');
  let menu = document.getElementById('menu');
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

//switch language
function switchLanguage() {
  let element = document.getElementById('languageMode');
  let targetDiv = document.getElementById('languageOptions');
  let targets = targetDiv.getElementsByTagName('a');
  let screen = document.getElementById('is-open-lang');

  element.addEventListener('click', () => {
    targetDiv.classList.toggle('hidden');
    screen.classList.toggle('hidden');
  });

  for (let target of targets) {
    target.addEventListener('click', () => {
      targetDiv.classList.toggle('hidden');
      screen.classList.toggle('hidden');
    });
  }
  screen.addEventListener('click', () => {
    targetDiv.classList.toggle('hidden');
    screen.classList.toggle('hidden');
  });
}
