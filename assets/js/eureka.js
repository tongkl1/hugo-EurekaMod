//Masonry Layout
function enableMasonry() {
  window.onload = resizeAllGridItems();
  window.addEventListener('resize', resizeAllGridItems);
  const imgs = document.getElementsByTagName('img');
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
  const element = document.getElementById('lightDarkMode');
  const targetDiv = document.getElementById('lightDarkOptions');
  const targets = targetDiv.getElementsByTagName('span');
  const screen = document.getElementById('is-open');

  element.addEventListener('click', () => {
    targetDiv.classList.toggle('hidden');
    screen.classList.toggle('hidden');
  });

  for (let target of targets) {
    target.addEventListener('click', () => {
      const targetName = target.getAttribute('name');
      const icon = switchMode(targetName);
      const old_icon = element.firstElementChild.getAttribute('data-icon');
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
  });
}

function switchMode(mode) {
  let icon = '';
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
  const menuBtn = document.getElementById('navbar-btn');
  const menu = document.getElementById('menu');
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}

//switch language
function switchLanguage() {
  const element = document.getElementById('languageMode');
  const targetDiv = document.getElementById('languageOptions');
  const targets = targetDiv.getElementsByTagName('a');
  const screen = document.getElementById('is-open-lang');

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
