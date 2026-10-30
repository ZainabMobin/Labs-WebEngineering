var mode = "month" //default monthly view is set
var curr_date = new Date() //global reference to current viewing date
var activeDateKey = null; // Currently selected date key for the task panel
var taskStore = {}; //store task per date ie key is date, value is memo info

function initializeView(){
    curr_date = new Date();
    mode = "month";
    document.querySelector('.switch-btn').textContent = mode;
    document.querySelector('#current-date').textContent = createDateString(curr_date);

    const month = curr_date.getMonth();
    const year = curr_date.getFullYear();
    const date = curr_date.getDate();
    renderCalendar(mode, year, month, date);
}

function createDateString(dateObj){
    var day = "Mon";
    switch (dateObj.getDay()){
        case 0: day = "Sun"; break;
        case 1: day = "Mon"; break;
        case 2: day = "Tue"; break;
        case 3: day = "Wed"; break;
        case 4: day = "Thu"; break;
        case 5: day = "Fri"; break;
        case 6: day = "Sat"; break;
    }
    
    var month = "January";
    switch(dateObj.getMonth()){
        case 0: month = "January"; break;
        case 1: month = "February"; break;
        case 2: month = "March"; break;
        case 3: month = "April"; break;
        case 4: month = "May"; break;
        case 5: month = "June"; break;
        case 6: month = "July"; break;
        case 7: month = "August"; break;
        case 8: month = "September"; break;
        case 9: month = "October"; break;
        case 10: month = "November"; break;
        case 11: month = "December"; break;
    }
    return ( day + ", " + month + " " + dateObj.getDate() + " " + dateObj.getFullYear() );
}

//increment date to next month if month mode 
//increment date to week's (7 days increment) if week mode 
function navigateBack(){
    const month = curr_date.getMonth();
    const year = curr_date.getFullYear();
    const date = curr_date.getDate();

    if (mode === "month"){
        curr_date = new Date(year, month - 1, date);
    } else if (mode === "week"){
        curr_date = new Date(year, month, date - 7);
    }
    
    renderCalendar(mode, curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate());
}       
                
function navigateForward(){
    let month = curr_date.getMonth();
    let year = curr_date.getFullYear();
    let date = curr_date.getDate();
    
    if (mode === "month"){
        let maxNextDays = new Date(year, month + 2, 0).getDate();
        // need to go with smaller date for overflow 
        // 31 -> 30, 29, 28
        // 30 -> 29, 28
        let targetDate = Math.min(date, maxNextDays);
        curr_date = new Date(year, month + 1, targetDate);
    }
    else if (mode === "week"){
        curr_date = new Date(year, month, date + 7);
    }
    
    renderCalendar(mode, curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate());
}


function switchMode(){
    if (mode === "month"){ mode = "week"; }
    else { mode = "month"; }

    document.querySelector('.switch-btn').textContent = mode;
    
    //re-render after mode change
    const month = curr_date.getMonth();
    const year = curr_date.getFullYear()
    const date = curr_date.getDate();
    renderCalendar(mode, year, month, date);
}

// accepts view mode and the date information to be displayed 
// (even though the saem global variable curr_date keeps track of what date is being rendered,
// we define the function specifications to have details passed as parameters for modularity,
//  and to anticipate the case when a single global date object shall not be used rather seperate state objects will be passed)

// JS Date object based parameters:
// day: 0-6
// month: 0-11
// year: integer year
function renderCalendar(view, year, month, date){
    document.querySelector('#current-date').textContent = createDateString(curr_date); //update master date
    
    const grid = document.querySelector('#cell-grid');
    grid.innerHTML="";
    
    if (view === "month"){
        const cell_num = 42;
        const firstDay = new Date(year, month, 1).getDay(); //under which day block to start placing
        const daysInMonth = new Date(year, month+1, 0).getDate(); //0 rolls back to final date number of prev month i.e., month instead of month+1; back to the future
        console.warn(curr_date);
        
        for (let i=0; i<cell_num; i++){
            const cell = document.createElement('div');
            cell.className = 'day-cell'
            
            const dayNum = i - firstDay + 1;
            // highlight if current selected date is this
            if (dayNum === date){
                cell.classList.add('current-cell');
            }
            
            // console.log("day num: "+ dayNum);
            // console.log("daysInMonth: "+ daysInMonth);
            // console.log("first day: "+ firstDay);
            if (dayNum < 1 || dayNum > daysInMonth){
                cell.classList.add('disabled-cell');
                var extremeMonthDate;
                if (dayNum < 1){ //previous month, offset is negative
                    cell.textContent = dayNum + getPrevMonthDate(year, month);
                }
                else if (dayNum > daysInMonth) { //offset is positive,  
                    cell.textContent = dayNum - daysInMonth ;
                }
            }
            else { //normal day within the month range
                cell.textContent = dayNum;
            }
            grid.appendChild(cell);
        }
    }
    else if (view === "week"){
        const targetDate = new Date(year, month, date);
        const dayOfWeek = targetDate.getDay();
  
        const weekStart = new Date(year, month, date - dayOfWeek);
        
        for (let i = 0; i < 7; i++){
            const cellDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
            const cell = document.createElement('div');
            cell.className = 'day-cell';

            if (cellDate.getFullYear() === curr_date.getFullYear() && 
                cellDate.getMonth() === curr_date.getMonth() && 
                cellDate.getDate() === curr_date.getDate()){
                cell.classList.add('current-cell');
            }
            // Disable extreme days (before/after curr month)
            if (cellDate.getMonth() !== month){
                cell.classList.add('disabled-cell');
            }
            
            cell.textContent = cellDate.getDate();
            grid.appendChild(cell);
        }
    }
}

function getPrevMonthDate(year, month){
    const prevMonthDays = new Date(year, month, 0).getDate();
    return prevMonthDays;
}

function getNextMonthDate(year, month){
    const nextMonthDays = new Date(year, month+2, 0).getDate();
    return nextMonthDays;
}

function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function handleCellClick(dateObj) {
    curr_date = dateObj;
    activeDateKey = formatDateKey(dateObj);

    // Update panel title header to reflect selected day
    document.querySelector('#panel-date-title').innerHTML = `Add Memo (${createDateString(dateObj)})`;
    
    renderCalendar(mode, curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate());
    renderTaskList();
}

function renderTaskList() {
    const listContainer = document.querySelector('#task-list');
    listContainer.innerHTML = "";

    if (!activeDateKey) {
        activeDateKey = formatDateKey(curr_date);
    }

    const tasks = taskStore[activeDateKey] || [];
    if (tasks.length === 0) {
        listContainer.innerHTML = "<p style='color: #777; margin-bottom: 1rem;'>No tasks recorded for this day.</p>";
        return;
    }

    tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item';

        const topicElement = document.createElement('div');
        topicElement.className = 'task-item-topic';
        topicElement.textContent = task.topic;
        item.appendChild(topicElement);

        if (task.description) {
            const descElement = document.createElement('div');
            descElement.className = 'task-item-desc';
            descElement.textContent = task.description;
            item.appendChild(descElement);
        }

        listContainer.appendChild(item);
    });
}

function handleSaveTask(event) {
    event.preventDefault();

    const topicInput = document.querySelector('#task-topic');
    const descInput = document.querySelector('#task-desc');

    const topic = topicInput.value.trim();
    const description = descInput.value.trim();

    if (!topic) return;

    if (!activeDateKey) {
        activeDateKey = formatDateKey(curr_date);
    }

    if (!taskStore[activeDateKey]) {
        taskStore[activeDateKey] = [];
    }

    taskStore[activeDateKey].push({ topic, description });

    topicInput.value = ""; //reset values at teh end
    descInput.value = "";

    renderTaskList();
    renderCalendar(mode, curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate());
}