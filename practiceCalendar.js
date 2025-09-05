/***** CONFIG + BREAKPOINT *****/
const mq = window.matchMedia('(max-width: 600px)');

const API_KEY = 'AIzaSyACeAr4hZMJ9axLPEMzLPZgQr8XkYAZl1k';
const PUBLIC_CAL_ID = '3cae1ba52ac23bca99893a1b81869bf4fd06aae62a79f167b7ac76510d26c045@group.calendar.google.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

/***** STATE *****/
let events = [];
let month, year;
let currentMode = null; // 'mobile' | 'desktop'

/***** GAPI ENTRY (HTML uses onload="gapiLoaded()") *****/
window.gapiLoaded = function () {
  gapi.load('client', initializeGapiClient);
};

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  listUpcomingEvents();
}

/***** FETCH + RENDER FLOW *****/
async function listUpcomingEvents() {
  let response;

  // fix month/year to "now"
  const now = new Date();
  month = now.getMonth();
  year  = now.getFullYear();

  const startOfMonth = new Date(year, month, 1).toISOString();
  const endOfMonth   = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const request = {
    calendarId: PUBLIC_CAL_ID,
    timeMin: startOfMonth,
    timeMax: endOfMonth,
    showDeleted: false,
    singleEvents: true,
    maxResults: 250,
    orderBy: 'startTime',
  };

  try {
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    const contentEl = document.getElementById('content');
    if (contentEl) contentEl.innerText = err.message || 'Error loading events.';
    return;
  }

  events = response.result.items || [];
  if (!events.length) {
    const contentEl = document.getElementById('content');
    if (contentEl) contentEl.innerText = 'No events found.';
    return;
  }

  // initial render (force flip)
  currentMode = null;
  renderByMode();

  // media query change + legacy
  const onMQChange = () => renderByMode();
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', onMQChange);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(onMQChange);
  }

  // resize guard (some emulations don't fire 'change' reliably)
  window.addEventListener('resize', () => {
    const nextMode = mq.matches ? 'mobile' : 'desktop';
    if (nextMode !== currentMode) renderByMode();
  });
}

/***** MODE SWITCH + WEEKDAY NAMES *****/
function getWeekdayNames() {
  // Change these to whatever you want to see on mobile
  return mq.matches
    ? ['TEST', 'TEST', 'TEST', 'WED', 'THU', 'FRI', 'SAT']  // MOBILE labels
    : ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];    // DESKTOP labels
}

function renderByMode() {
  if (!events.length) return;

  const nextMode = mq.matches ? 'mobile' : 'desktop';
  if (nextMode === currentMode) return; // no-op if mode didn't change

  currentMode = nextMode;
  console.log('Rendering:', currentMode.toUpperCase());

  if (currentMode === 'mobile') {
    renderMobileCalendar(events, month, year);
  } else {
    renderCalendar(events, month, year);
  }
}

/***** DESKTOP RENDERER *****/
function renderCalendar(events, month, year) {
  const header = document.getElementById('calendar-header');
  const grid = document.getElementById('calendar-grid');
  if (!header || !grid) return;

  const weekdayNames = getWeekdayNames();
  const monthNames = [
    'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
    'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
  ];

  header.innerText = `${monthNames[month]} ${year}`;
  grid.innerHTML = '';

  // week headers
  for (let i = 0; i < weekdayNames.length; i++) {
    const weekName = document.createElement('div');
    weekName.className = 'calendar-row-header';
    weekName.innerHTML = `<div>${weekdayNames[i]}</div>`;
    grid.append(weekName);
  }

  // month math
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();

  // prev month tail
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day other-month';
    cell.innerHTML = `<div class="day-number">${d}</div>`;
    grid.appendChild(cell);
  }

  // icons
  const pokeIcon   = './image assets/PokeBall.png';
  const smashIcon  = './image assets/SmashBrothersIcon.png';
  const logoIcon   = './image assets/LogoIcon.png';
  const ggIcon     = './image assets/GuiltyGearIcon.png';
  const sfIcon     = '/image assets/SFLogo.png';
  const fgcIcon    = './image assets/FGC_Logo.png';
  const mtgIcon    = './image assets/MTG_Logo.png';
  const tknIcon    = './image assets/Tekken8Logo.png';
  const lorcanaIcon= './image assets/lorcana_icon.png';
  const dndIcon    = './image assets/dnd_logo.png';
  const gndmIcon   = './image assets/gundam_logo.png';
  const onepIcon   = './image assets/onep_icon.png';

  // month cells
  for (let date = 1; date <= daysInMonth; date++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day this-month';
    cell.innerHTML = `<div class="day-number">${date}</div>`;

    const evList = document.createElement('div');
    evList.className = 'events';

    const dateStr = new Date(year, month, date).toISOString().slice(0, 10);

    events
      .filter(ev => (ev.start?.dateTime || ev.start?.date || '').slice(0,10) === dateStr)
      .forEach(ev => {
        const item = document.createElement('div');
        item.className = 'tooltip event';

        const title = ev.summary || '(untitled)';
        const icon  = document.createElement('img');
        icon.className = 'calendar-icon';

        if (title.includes('Smash')) icon.src = smashIcon;
        else if (title.includes('Pokemon')) icon.src = pokeIcon;
        else if (title.includes('Guilty')) icon.src = ggIcon;
        else if (title.includes('Street')) icon.src = sfIcon;
        else if (title.includes('FGC')) icon.src = fgcIcon;
        else if (title.includes('Magic')) icon.src = mtgIcon;
        else if (title.includes('Lorcana')) icon.src = lorcanaIcon;
        else if (title.includes('Dungeons')) icon.src = dndIcon;
        else if (title.includes('Gundam')) icon.src = gndmIcon;
        else if (title.includes('Piece')) icon.src = onepIcon;
        else if (title.includes('Tekken')) icon.src = tknIcon;
        else icon.src = logoIcon;

        let eventStartTime, eventEndTime = '';
        if (ev.start?.dateTime) {
          const dst = new Date(ev.start.dateTime);
          eventStartTime = dst.toLocaleTimeString(['en-us'], { hour: 'numeric', minute: '2-digit' });
          if (ev.end?.dateTime) {
            const dnt = new Date(ev.end.dateTime);
            eventEndTime = `- ${dnt.toLocaleTimeString(['en-us'], { hour: 'numeric', minute: '2-digit' })}`;
          }
        } else {
          eventStartTime = 'All Day';
        }

        const tip = document.createElement('span');
        tip.className = 'tooltiptext';

        const titleLine = document.createElement('strong');
        titleLine.className = 'event-title';
        titleLine.textContent = title;
        tip.appendChild(titleLine);

        const times = document.createElement('p');
        times.id = 'event-times';
        times.textContent = `${eventStartTime} ${eventEndTime}`;
        tip.appendChild(times);

        const descBlock = document.createElement('h5');
        descBlock.className = 'event-desc';
        descBlock.innerHTML = ev.description || '';
        tip.appendChild(descBlock);

        const btn = document.createElement('a');
        btn.innerText = 'Add To My Calendar';
        btn.className = 'tooltip-button';
        btn.id = 'tool-tip-btn';
        btn.href = '';
        tip.appendChild(btn);

        item.appendChild(tip);
        item.appendChild(icon);
        evList.appendChild(item);
      });

    cell.appendChild(evList);
    grid.appendChild(cell);
  }

  // next month head fill
  const totalCells = firstDay + daysInMonth;
  const need = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= need; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day other-month';
    cell.innerHTML = `<div class="day-number">${d}</div>`;
    grid.appendChild(cell);
  }

  // tooltips
  const cGrid = document.getElementById('calendar-grid');
  cGrid.addEventListener('click', expandToolTip);

  function expandToolTip(e) {
    const icon = e.target.closest('.calendar-icon');
    if (!icon) return;

    const card = icon.closest('.event');
    const tip = card.querySelector('.tooltiptext');
    if (!tip) return;

    cGrid.querySelectorAll('.tooltiptext.expand').forEach(t => { if (t !== tip) t.classList.remove('expand'); });

    const eventDesc = tip.querySelector('.event-desc');
    cGrid.querySelectorAll('.event-desc.show-desc').forEach(t => { if (t !== eventDesc) t.classList.remove('show-desc'); });

    const eventBtn = tip.querySelector('.tooltip-button');
    cGrid.querySelectorAll('.tooltip-button.show-desc').forEach(t => { if (t !== eventBtn) t.classList.remove('show-desc'); });

    eventBtn.classList.toggle('show-desc');
    eventDesc.classList.toggle('show-desc');
    tip.classList.toggle('expand');
  }

  document.addEventListener('click', function (e) {
    const cls = e.target.className;
    if (cls !== 'calendar-icon' && cls !== 'tooltip-button show-desc') {
      cGrid.querySelectorAll('.tooltiptext.expand').forEach(t => t.classList.remove('expand'));
      cGrid.querySelectorAll('.event-desc.show-desc').forEach(t => t.classList.remove('show-desc'));
      cGrid.querySelectorAll('.tooltip-button.show-desc').forEach(t => t.classList.remove('show-desc'));
    }
  });
}

/***** MOBILE RENDERER *****/
function renderMobileCalendar(events, month, year) {
  const header = document.getElementById('calendar-header');
  const grid = document.getElementById('calendar-grid');
  if (!header || !grid) return;

  const weekdayNames = getWeekdayNames();
  const monthNames = [
    'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
    'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
  ];

  header.innerText = `${monthNames[month]} ${year}`;
  grid.innerHTML = '';

  for (let i = 0; i < weekdayNames.length; i++) {
    const weekName = document.createElement('div');
    weekName.className = 'calendar-row-header';
    weekName.innerHTML = `<div>${weekdayNames[i]}</div>`;
    grid.append(weekName);
  }

  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day other-month';
    cell.innerHTML = `<div class="day-number">${d}</div>`;
    grid.appendChild(cell);
  }

  const pokeIcon   = './image assets/PokeBall.png';
  const smashIcon  = './image assets/SmashBrothersIcon.png';
  const logoIcon   = './image assets/LogoIcon.png';
  const ggIcon     = './image assets/GuiltyGearIcon.png';
  const sfIcon     = '/image assets/SFLogo.png';
  const fgcIcon    = './image assets/FGC_Logo.png';
  const mtgIcon    = './image assets/MTG_Logo.png';
  const tknIcon    = './image assets/Tekken8Logo.png';
  const lorcanaIcon= './image assets/lorcana_icon.png';
  const dndIcon    = './image assets/dnd_logo.png';
  const gndmIcon   = './image assets/gundam_logo.png';
  const onepIcon   = './image assets/onep_icon.png';

  for (let date = 1; date <= daysInMonth; date++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day this-month';
    cell.innerHTML = `<div class="day-number">${date}</div>`;

    const evList = document.createElement('div');
    evList.className = 'events';

    const dateStr = new Date(year, month, date).toISOString().slice(0, 10);

    events
      .filter(ev => (ev.start?.dateTime || ev.start?.date || '').slice(0,10) === dateStr)
      .forEach(ev => {
        const item = document.createElement('div');
        item.className = 'tooltip event';

        const title = ev.summary || '(untitled)';
        const icon  = document.createElement('img');
        icon.className = 'calendar-icon';

        if (title.includes('Smash')) icon.src = smashIcon;
        else if (title.includes('Pokemon')) icon.src = pokeIcon;
        else if (title.includes('Guilty')) icon.src = ggIcon;
        else if (title.includes('Street')) icon.src = sfIcon;
        else if (title.includes('FGC')) icon.src = fgcIcon;
        else if (title.includes('Magic')) icon.src = mtgIcon;
        else if (title.includes('Lorcana')) icon.src = lorcanaIcon;
        else if (title.includes('Dungeons')) icon.src = dndIcon;
        else if (title.includes('Gundam')) icon.src = gndmIcon;
        else if (title.includes('Piece')) icon.src = onepIcon;
        else if (title.includes('Tekken')) icon.src = tknIcon;
        else icon.src = logoIcon;

        let eventStartTime, eventEndTime = '';
        if (ev.start?.dateTime) {
          const dst = new Date(ev.start.dateTime);
          eventStartTime = dst.toLocaleTimeString(['en-us'], { hour: 'numeric', minute: '2-digit' });
          if (ev.end?.dateTime) {
            const dnt = new Date(ev.end.dateTime);
            eventEndTime = `- ${dnt.toLocaleTimeString(['en-us'], { hour: 'numeric', minute: '2-digit' })}`;
          }
        } else {
          eventStartTime = 'All Day';
        }

        const tip = document.createElement('span');
        tip.className = 'tooltiptext';

        const titleLine = document.createElement('strong');
        titleLine.className = 'event-title';
        titleLine.textContent = title;
        tip.appendChild(titleLine);

        const times = document.createElement('p');
        times.id = 'event-times';
        times.textContent = `${eventStartTime} ${eventEndTime}`;
        tip.appendChild(times);

        const descBlock = document.createElement('h5');
        descBlock.className = 'event-desc';
        descBlock.innerHTML = ev.description || '';
        tip.appendChild(descBlock);

        const btn = document.createElement('a');
        btn.innerText = 'Add To My Calendar';
        btn.className = 'tooltip-button';
        btn.id = 'tool-tip-btn';
        btn.href = '';
        tip.appendChild(btn);

        item.appendChild(tip);
        item.appendChild(icon);
        evList.appendChild(item);
      });

    cell.appendChild(evList);
    grid.appendChild(cell);
  }

  const totalCells = firstDay + daysInMonth;
  const need = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= need; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day other-month';
    cell.innerHTML = `<div class="day-number">${d}</div>`;
    grid.appendChild(cell);
  }

  const cGrid = document.getElementById('calendar-grid');
  cGrid.addEventListener('click', expandToolTip);

  function expandToolTip(e) {
    const icon = e.target.closest('.calendar-icon');
    if (!icon) return;

    const card = icon.closest('.event');
    const tip = card.querySelector('.tooltiptext');
    if (!tip) return;

    cGrid.querySelectorAll('.tooltiptext.expand').forEach(t => { if (t !== tip) t.classList.remove('expand'); });

    const eventDesc = tip.querySelector('.event-desc');
    cGrid.querySelectorAll('.event-desc.show-desc').forEach(t => { if (t !== eventDesc) t.classList.remove('show-desc'); });

    const eventBtn = tip.querySelector('.tooltip-button');
    cGrid.querySelectorAll('.tooltip-button.show-desc').forEach(t => { if (t !== eventBtn) t.classList.remove('show-desc'); });

    eventBtn.classList.toggle('show-desc');
    eventDesc.classList.toggle('show-desc');
    tip.classList.toggle('expand');
  }

  document.addEventListener('click', function (e) {
    const cls = e.target.className;
    if (cls !== 'calendar-icon' && cls !== 'tooltip-button show-desc') {
      cGrid.querySelectorAll('.tooltiptext.expand').forEach(t => t.classList.remove('expand'));
      cGrid.querySelectorAll('.event-desc.show-desc').forEach(t => t.classList.remove('show-desc'));
      cGrid.querySelectorAll('.tooltip-button.show-desc').forEach(t => t.classList.remove('show-desc'));
    }
  });
}

/***** PNG DOWNLOAD (html2canvas) *****/
const dlBtn = document.getElementById('download-png');
if (dlBtn) {
  dlBtn.addEventListener('click', saveCalendarImage);
}

async function saveCalendarImage() {
  const target = document.getElementById('calendar-capture');
  if (!target) return;

  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch {}
  }

  const canvas = await html2canvas(target, {
    backgroundColor: '#000000',
    scale: Math.min(3, (window.devicePixelRatio || 1) * 2),
    useCORS: true,
    logging: false,
  });

  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().slice(0,10);
      a.href = url;
      a.download = `calendar-${stamp}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  } else {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'calendar.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
