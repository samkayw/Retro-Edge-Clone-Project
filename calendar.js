let mq = window.matchMedia('(max-width: 900px)'); //grab window size

//calendar params cache
let EVENTS = [];
let CUR_MONTH = null;
let CUR_YEAR = null;



   // check for window size
if (mq.addEventListener) {

    mq.addEventListener('change', renderCalendarType);  

} else {

}


      const API_KEY = 'AIzaSyACeAr4hZMJ9axLPEMzLPZgQr8XkYAZl1k';
      const PUBLIC_CAL_ID = '3cae1ba52ac23bca99893a1b81869bf4fd06aae62a79f167b7ac76510d26c045@group.calendar.google.com';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';


      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        // gapiInited = true;
          // maybeEnableButtons();
          listUpcomingEvents();
      }


//async grab calendar events
      async function listUpcomingEvents() {
        //create a response variable to be packed later
        let response;
        //try to get a list of these items
        try {
            // API Calls List
            

            // derive month/year here
            const now   = new Date();
            const year  = now.getFullYear();
            const month = now.getMonth(); // 0 = Jan
          //get the start and end parameters for the time frame  
            const startOfMonth = new Date(year, month, 1).toISOString();
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
            
            const request = {
                'calendarId': PUBLIC_CAL_ID,
                //timeMin is filtering for dates that don't start today  
                //'timeMin': (new Date()).toISOString(),
                'timeMin': startOfMonth,
                'timeMax': endOfMonth,
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 250,
                'orderBy': 'startTime',
            };
            
// API Calls List
        // once thats done, put it in here
          response = await gapi.client.calendar.events.list(request);
          
        //if something doesn't work, throw this error
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }

        //drill down into response just to get the items and save it into the events
        const events = response.result.items || [];
        const now = new Date();

        EVENTS    = events;              // cache for later
        CUR_MONTH = now.getMonth();
        CUR_YEAR  = now.getFullYear();

        renderCalendarType();   

        //if there's no events show it here
        if (!events || events.length == 0) {
          document.getElementById('content').innerText = 'No events found.';
          return;
        }
        
      } 
      
function renderCalendarType() {
    if (CUR_MONTH === null || CUR_YEAR === null) return;  

    //clear before re-render
    const grid = document.getElementById('calendar-grid');
    if (grid) grid.innerHTML = '';                        

    if (mq.matches) {
        renderCalendarMobile(EVENTS, CUR_MONTH, CUR_YEAR);
    } else {
        renderCalendar(EVENTS, CUR_MONTH, CUR_YEAR);
    }
    }

 


//MY CALENDAR VARIABLES
function renderCalendar(events, month, year) {
    console.log('this is desktop')
    const header = document.getElementById('calendar-header');
    const weekdayNames = [
        'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
    ];

    const weekdayLength = weekdayNames.length;

    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    header.innerText = `${monthNames[month]} ${year}`;

    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

  
    //insert days of the week headers
    for (let i = 0; weekdayLength > i; i++) {
        const weekName = document.createElement('div')
        weekName.className = 'calendar-row-header';
        weekName.innerHTML = `<div>${weekdayNames[i]}</div>`;
        grid.append(weekName);
    };


    // 1) Compute first weekday & month lengths
    const firstDay = new Date(year, month, 1).getDay();       // 0=Sun…6=Sat on this day is Tuesday
    const daysInMonth = new Date(year, month + 1, 0).getDate();    // e.g. 31 days of the current month and +1 because we init from index 0
    const daysInPrev = new Date(year, month, 0).getDate();    // e.g. 30 for June 

    // 2) Fill in tail of previous month (so “1” of this month lines up)
    //make i = to first day, which is 2 because it starts on tuesday and subtract 1 because >=. As long as i (1) is greater than or equal to 0 then create a variable called d which is days in prev - 1 = 29. and then make a thing called cell which is an empty div. Take the cell and give it 2 classes, calendar-day and other-month. Change the html to include the day number and then add it to the grid. This happens just two times 
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrev - i;
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        // image test
        cell.innerHTML = `<div class="day-number">${d}</div>`;
        grid.appendChild(cell);
    }

    // 3) Fill in **this** month, with events
    // if date is 1 and it is less than or equal to days in month which is 31 we will create a cell which is an empy div and give it a class of this month calendar-day. And then we give an innerhtml of day number and insert the date which will serve as the day number. And then create something called an evlist and set that to an empty div then give it a class called events. And then we will make a datestring called dateStr and we'll slice it down to a YYYY-MM-DD format we then take the given events param and filter it down with an ev token and if the start.dateTime matches the dateStr we will create an item that is an empty div, give that item a calss of event, make the inner html the event title and append it into the event list for that day and we'll increment until we're done. After we've done that we'll put the evlist in the 
    const pokeIcon = './image assets/PokeBall.png'
    const smashIcon = './image assets/SmashBrothersIcon.png'
    const logoIcon = './image assets/LogoIcon.png'
    const ggIcon = './image assets/GuiltyGearIcon.png'
    const sfIcon = '/image assets/SFLogo.png'
    const fgcIcon = './image assets/FGC_Logo.png'
    const mtgIcon = './image assets/MTG_Logo.png'
    const tknIcon = './image assets/Tekken8Logo.png'
    const lorcanaIcon = './image assets/lorcana_icon.png'
    const dndIcon = './image assets/dnd_logo.png'
    const gndmIcon = './image assets/gundam_logo.png'
    const onepIcon = './image assets/onep_icon.png'



    for (let date = 1; date <= daysInMonth; date++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day this-month';

        // a) Day number
        cell.innerHTML = `<div class="day-number">${date} </div>`;

        // b) Event container
        const evList = document.createElement('div');
        evList.className = 'events';



        // c) Attach any events that match this date
        const dateStr = new Date(year, month, date).toISOString().slice(0, 10); // “YYYY-MM-DD”
        events.filter(ev => (ev.start.dateTime || ev.start.date).slice(0, 10) === dateStr).forEach(ev => {
        
            const item = document.createElement('div');
            const title = ev.summary;
            const icon = document.createElement('img');
            const btn = document.createElement('a')
            const eDesc = ev.description;

            // Start and end times
            let eventStartTime;
            let eventEndTime;

            if (ev.start.dateTime) {
                const dst = new Date(ev.start.dateTime);
                eventStartTime = dst.toLocaleTimeString(["en-us"], { hour: 'numeric', minute: '2-digit' });

                const dnt = new Date(ev.end.dateTime);
                eventEndTime = `- ${dnt.toLocaleTimeString(["en-us"], { hour: 'numeric', minute: '2-digit' })}`

            } else {
                eventStartTime = 'All Day'
                eventEndTime = ''
            }

            //checks the event name and places the corresponding icon
            if (title.includes('Smash')) {
                icon.src = smashIcon;

            } else if (title.includes('Pokemon')) {
                icon.src = pokeIcon
          
            } else if (title.includes('Guilty')) {
                icon.src = ggIcon;
          
            } else if (title.includes('Street')) {
                icon.src = sfIcon
          
            } else if (title.includes('FGC')) {
                icon.src = fgcIcon

            } else if (title.includes('Magic')) {
                icon.src = mtgIcon

            } else if (title.includes('Lorcana')) {
                icon.src = lorcanaIcon

            } else if (title.includes('Dungeons')) {
                icon.src = dndIcon

            } else if (title.includes('Gundam')) {
                icon.src = gndmIcon

            } else if (title.includes('Piece')) {
                icon.src = onepIcon

            } else if (title.includes('Tekken')) {
                icon.src = tknIcon
            }   
            
             else {
                icon.src = logoIcon
          
            };

            //create the tool tip
            const tip = document.createElement('span');
            tip.className = 'tooltiptext';
        
            //create the header text and add it to the tool tip
            const titleLine = document.createElement('strong')
            titleLine.className = 'event-title'
            titleLine.textContent = title;
            tip.appendChild(titleLine)

            //create the event times and add it to the tooltip
            const times = document.createElement('p')
            times.id = 'event-times'
            times.textContent = `${eventStartTime} ${eventEndTime}`
            tip.appendChild(times)

            // create event description and put it in the tool tip
            const descBlock = document.createElement('h5')
            descBlock.className = 'event-desc'
            //flag security issue for XSS attacks and a solution for this
            //look into dom purify and white listing allowable tags
            descBlock.innerHTML = eDesc;
            tip.appendChild(descBlock)

            //add a button to the tool tip
            btn.innerText = 'Add To My Calendar'
            btn.className = 'tooltip-button'
            btn.id = 'tool-tip-btn'
            btn.href = ''
            tip.appendChild(btn)

            //give a class to the icon for style
            icon.className = 'calendar-icon';
        

            item.appendChild(tip)
            item.appendChild(icon);
            item.className = 'tooltip event';
            evList.appendChild(item);
            

        });

        cell.appendChild(evList);
        grid.appendChild(cell);
        
    }

    


    // 4) Fill in head of next month so last week is full
    const totalCells = firstDay + daysInMonth;
    const need = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= need; d++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        cell.innerHTML = `<div class="day-number">${d}</div>`;
        grid.appendChild(cell);
    }


    //gets the whole calendar
    const cGrid = document.getElementById('calendar-grid')

    //listen in on the calendar
    cGrid.addEventListener('click', expandToolTip)
    document.addEventListener('click', outSideClick)



    //toggle the classes 
    function expandToolTip(e) {
        // grabs the closest calendar icon
        const icon = e.target.closest('.calendar-icon') //get the icon I clicked
        if (!icon) return;
        
        const card = icon.closest('.event');          //find the icon's event ifo
        const tip = card.querySelector('.tooltiptext'); //get the event info's tooltip
        if (!tip) return;
        // const isOpen = true

        //checks if other tooltips are open other than the one we have open right now
        const openTips = cGrid.querySelectorAll('.tooltiptext.expand');
        openTips.forEach(t => {
            if (t !== tip) t.classList.remove('expand');
        });

        //get the closest event description and then display it
        const eventDesc = tip.querySelector('.event-desc')
        //close it if you click on another icon
        const openDescs = cGrid.querySelectorAll('.event-desc.show-desc');
        openDescs.forEach(t => {
            if (t !== eventDesc) t.classList.remove('show-desc')
        })
        
        const eventBtn = tip.querySelector('.tooltip-button')
        const openBtns = cGrid.querySelectorAll('.tooltip-button.show-desc');
        openBtns.forEach(t => {
            if (t !== eventBtn) t.classList.remove('show-desc')
        })
        
        //toggle it on and off
        eventBtn.classList.toggle('show-desc')
        eventDesc.classList.toggle('show-desc')
        tip.classList.toggle('expand'); //toggle it
    }


    //close icon if you click outside of the icon
    function outSideClick (e) {

        const userClick = e.target.className
        console.log(userClick)

        if (userClick !== 'calendar-icon' && userClick !== 'tooltip-button show-desc' ) {
            // closes it if anything other than an icon is clicked
            const eventMenu = cGrid.querySelectorAll('.tooltiptext.expand')
            eventMenu.forEach(t => t.classList.remove('expand'));

            //remove other event descriptions
            const eventDesc = cGrid.querySelectorAll('.event-desc.show-desc')
            eventDesc.forEach(t => t.classList.remove('show-desc'))

            //remove other buttons
            const eventBtn = cGrid.querySelectorAll('.tooltip-button.show-desc')
            eventBtn.forEach(t => t.classList.remove('show-desc'))
            
        }
    
    }
     
      
}

//MY CALENDAR VARIABLES
function renderCalendarMobile(events, month, year) {
    console.log('this is mobile')
    const header = document.getElementById('calendar-header');
    const weekdayNames = [
        'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
    ];

    const weekdayLength = weekdayNames.length;

    const monthNames = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];

    header.innerText = `${monthNames[month]} ${year}`;

    //calendar skeleton
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    //mobile card sections skeleton
    const mobileSection = document.getElementById('mobile-calendar-section');
    mobileSection.innerHTML = '';

    
  
    //insert days of the week headers
    for (let i = 0; weekdayLength > i; i++) {
        const weekName = document.createElement('div')
        weekName.className = 'calendar-row-header';
        weekName.innerHTML = `<div>${weekdayNames[i]}</div>`;
        grid.append(weekName);
    };


    // 1) Compute first weekday & month lengths
    const firstDay = new Date(year, month, 1).getDay();       // 0=Sun…6=Sat on this day is Tuesday
    const daysInMonth = new Date(year, month + 1, 0).getDate();    // e.g. 31 days of the current month and +1 because we init from index 0
    const daysInPrev = new Date(year, month, 0).getDate();    // e.g. 30 for June 

    // 2) Fill in tail of previous month (so “1” of this month lines up)
    //make i = to first day, which is 2 because it starts on tuesday and subtract 1 because >=. As long as i (1) is greater than or equal to 0 then create a variable called d which is days in prev - 1 = 29. and then make a thing called cell which is an empty div. Take the cell and give it 2 classes, calendar-day and other-month. Change the html to include the day number and then add it to the grid. This happens just two times 
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrev - i;
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        // image test
        cell.innerHTML = `<div class="day-number">${d}</div>`;
        grid.appendChild(cell);
    }

    // 3) Fill in **this** month, with events
    // if date is 1 and it is less than or equal to days in month which is 31 we will create a cell which is an empy div and give it a class of this month calendar-day. And then we give an innerhtml of day number and insert the date which will serve as the day number. And then create something called an evlist and set that to an empty div then give it a class called events. And then we will make a datestring called dateStr and we'll slice it down to a YYYY-MM-DD format we then take the given events param and filter it down with an ev token and if the start.dateTime matches the dateStr we will create an item that is an empty div, give that item a calss of event, make the inner html the event title and append it into the event list for that day and we'll increment until we're done. After we've done that we'll put the evlist in the 
    const pokeIcon = './image assets/PokeBall.png'
    const smashIcon = './image assets/SmashBrothersIcon.png'
    const logoIcon = './image assets/LogoIcon.png'
    const ggIcon = './image assets/GuiltyGearIcon.png'
    const sfIcon = '/image assets/SFLogo.png'
    const fgcIcon = './image assets/FGC_Logo.png'
    const mtgIcon = './image assets/MTG_Logo.png'
    const tknIcon = './image assets/Tekken8Logo.png'
    const lorcanaIcon = './image assets/lorcana_icon.png'
    const dndIcon = './image assets/dnd_logo.png'
    const gndmIcon = './image assets/gundam_logo.png'
    const onepIcon = './image assets/onep_icon.png'



    for (let date = 1; date <= daysInMonth; date++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day this-month';
        

        //Day number
        cell.innerHTML = `<div class="day-number">${date}</div>`;

        const dateStr = new Date(year, month, date).toISOString().slice(0, 10);

        //some checks if at least one thigns meets the params
        const hasEvents = events.some(ev => 
            (ev.start.date || ev.start.dateTime).slice(0,10) === dateStr

        )

        if (hasEvents) {
            x = cell.querySelector('.day-number')
            x.classList.add('bell')
        }
    
        // mobileCard.appendChild(evList)
        // cell.appendChild(evList);
        grid.appendChild(cell);

    }



    //loops for all the days in the month
    for (let date = 1; date <= daysInMonth; date++) {

        //building the container cards that go underneath the calendar
        const evList = document.createElement('div');
        evList.className = 'events';

        //YYYY-MM-DD
        let dateStr = new Date(year, month, date).toISOString().slice(0, 10); // 
        
    
        //filter events out into groups matching the corresponding YYYY-MM-DD
        events.filter(ev => (ev.start.dateTime || ev.start.date).slice(0, 10) === dateStr).forEach(ev => {

            // console.log(date)

            console.log(ev.start.dateTime)

            const item = document.createElement('div');

            const title = ev.summary;

            const icon = document.createElement('img');

            const btn = document.createElement('a')

            const eDesc = ev.description;

            // Start and end times
            let eventStartTime;
            let eventEndTime;

            if (ev.start.dateTime) {
                const dst = new Date(ev.start.dateTime);
                eventStartTime = dst.toLocaleTimeString(["en-us"], { hour: 'numeric', minute: '2-digit' });

                const dnt = new Date(ev.end.dateTime);
                eventEndTime = `- ${dnt.toLocaleTimeString(["en-us"], { hour: 'numeric', minute: '2-digit' })}`

            } else {
                eventStartTime = 'All Day'
                eventEndTime = ''
            }

            //checks the event name and places the corresponding icon
            if (title.includes('Smash')) {
                icon.src = smashIcon;

            } else if (title.includes('Pokemon')) {
                icon.src = pokeIcon
          
            } else if (title.includes('Guilty')) {
                icon.src = ggIcon;
          
            } else if (title.includes('Street')) {
                icon.src = sfIcon
          
            } else if (title.includes('FGC')) {
                icon.src = fgcIcon

            } else if (title.includes('Magic')) {
                icon.src = mtgIcon

            } else if (title.includes('Lorcana')) {
                icon.src = lorcanaIcon

            } else if (title.includes('Dungeons')) {
                icon.src = dndIcon

            } else if (title.includes('Gundam')) {
                icon.src = gndmIcon

            } else if (title.includes('Piece')) {
                icon.src = onepIcon

            } else if (title.includes('Tekken')) {
                icon.src = tknIcon
            }
            
            else {
                icon.src = logoIcon
          
            };

            //create the tool tip
            // const tip = document.createElement('span');
            // tip.className = 'tooltiptext';

            //event block
            const eventBlock = document.createElement('div')
            eventBlock.className = 'event-block'
        
            //create the header text and add it to the tool tip
            const titleLine = document.createElement('strong')
            titleLine.className = 'event-title'
            titleLine.textContent = title;
            eventBlock.appendChild(titleLine)

            //create the event times and add it to the tooltip
            const times = document.createElement('p')
            times.id = 'event-times'
            times.textContent = `${eventStartTime} ${eventEndTime}`
            eventBlock.appendChild(times)

            // create event description and put it in the tool tip
            const descBlock = document.createElement('h5')
            descBlock.className = 'event-desc'

            //flag security issue for XSS attacks and a solution for this
            //look into dom purify and white listing allowable tags
            descBlock.innerHTML = eDesc;
            item.appendChild(descBlock)

            //add a button to the tool tip
            btn.innerText = 'Add To My Calendar'
            btn.className = 'tooltip-button'
            btn.id = 'tool-tip-btn'
            btn.href = ''
            evList.appendChild(btn)

            //give a class to the icon for style
            icon.className = 'calendar-icon';
        

            // item.appendChild(tip)
            item.appendChild(icon);
            item.className = 'tooltip event';


            item.appendChild(eventBlock)
            evList.appendChild(item);
            mobileSection.appendChild(evList)
        });

    }

    //fill in head of next month so last week is full
    const totalCells = firstDay + daysInMonth;
    const need = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= need; d++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day other-month';
        cell.innerHTML = `<div class="day-number">${d}</div>`;
        grid.appendChild(cell);
    }


    //gets the whole calendar
    const cGrid = document.getElementById('calendar-grid')

    cGrid.addEventListener('click', dayClick)

    //auto select today
    const today = new Date();
    if (today.getMonth() === month && today.getFullYear() === year) {
        const dayCells = cGrid.querySelectorAll('.calendar-day.this-month');

        //grab every cell and see if its day number matches then click 
        dayCells.forEach(cell => {
            const dayText = cell.querySelector('.day-number')?.textContent.trim();

            if (parseInt(dayText) === today.getDate()) {

                //auto click the matching click
                cell.click();
                }
        });
    }

    function dayClick(e) {

        // const today = new Date().toISOString.slice(0, 10)


        //grab the closest cell
        const cell = e.target.closest('.this-month');
        if (!cell) return;

        //unselect all cells before selecting
        const selectedCells = cGrid.querySelectorAll('.calendar-day.this-month.selected');
        selectedCells.forEach(t => {
            if (t !== cell) t.classList.remove('selected');
        });

        //apply selected state
        cell.classList.toggle('selected');
        

        //get clicked day number
        const dayNumber = parseInt(cell.querySelector('.day-number').textContent.trim(), 10);

        //construct YYYY-MM-DD string
        const clickedDate = new Date(CUR_YEAR, CUR_MONTH, dayNumber).toISOString().slice(0, 10);

        //clear previous event cards
        const mobileSection = document.getElementById('mobile-calendar-section');
        mobileSection.innerHTML = '';

        //render only the events that match clickedDate
        const filteredEvents = EVENTS.filter(ev =>
            (ev.start.dateTime || ev.start.date).slice(0, 10) === clickedDate
        );

        //if no events
        if (filteredEvents.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Closed';
            mobileSection.appendChild(emptyMsg);
            return;
        }

        filteredEvents.forEach(ev => {
            const item = document.createElement('div');
            const title = ev.summary;
            const icon = document.createElement('img');
            const btn = document.createElement('a');
            const eDesc = ev.description;

            let eventStartTime;
            let eventEndTime;
            if (ev.start.dateTime) {
                const dst = new Date(ev.start.dateTime);
                eventStartTime = dst.toLocaleTimeString(["en-us"], { hour: 'numeric', minute: '2-digit' });
                const dnt = new Date(ev.end.dateTime);
                eventEndTime = `- ${dnt.toLocaleTimeString(["en-us"], { hour: 'numeric', minute: '2-digit' })}`;
            } else {
                eventStartTime = 'All Day';
                eventEndTime = '';
            }

            //assign icon based on title
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

            icon.className = 'calendar-icon';

            const eventBlock = document.createElement('div');
            eventBlock.className = 'event-block';

            const titleLine = document.createElement('strong');
            titleLine.className = 'event-title';
            titleLine.textContent = title;

            const times = document.createElement('p');
            times.id = 'event-times';
            times.textContent = `${eventStartTime} ${eventEndTime}`;

            const descBlock = document.createElement('h5');
            descBlock.className = 'event-desc';
            descBlock.innerHTML = eDesc;

            btn.innerText = 'Add To My Calendar';
            btn.className = 'tooltip-button';
            btn.id = 'tool-tip-btn';
            btn.href = '';

            eventBlock.appendChild(titleLine);
            eventBlock.appendChild(times);

            item.appendChild(icon);
            item.appendChild(eventBlock);
            item.appendChild(descBlock);
            item.appendChild(btn);
            item.className = 'tooltip event';

            const evList = document.createElement('div');
            evList.className = 'events';
            evList.appendChild(item);

            mobileSection.appendChild(evList);
        });
     
      
    }
}


//creates the hook for our button
//listen for the when the user clicks the button 
const dlBtn = document.getElementById('download-png');
dlBtn.addEventListener('click', saveCalendarImage);

//listener function
async function saveCalendarImage() {
  const target = document.getElementById('calendar-capture'); //grabs the hmtl2canvas listener div

  //make sure fonts/images are ready so the snapshot looks right
  if (document.fonts && document.fonts.ready) {
      try {
          await document.fonts.ready;

      } catch { 
          
      }
  }

  //setting some quality controls from the html2canvas library
  const canvas = await html2canvas(target, {
    backgroundColor: '#000000ff',
    scale: Math.min(3, window.devicePixelRatio * 2), //sharper PNG, cap scale
    useCORS: true,
    logging: false, //keep info out of the console
  });

  //download as PNG (with fallback for older Safari)
  if (canvas.toBlob) {
      canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob); //using the URL api and its property to create a url with the blob data
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
    // fallback
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `calendar.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
    
}



