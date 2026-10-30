var mode = "month" //default monthly view is set
var curr_date = new Date() //global reference to current viewing date
var activeDateKey = null; // Currently selected date key for the task panel
var taskStore = {}; //store task per date ie key is date, value is memo info
var activeDate = new Date();

function initializeView(){
    curr_date = new Date();
    activeDate = new Date();
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
            // all days valid initially
            cell.className = 'day-cell'
            
            const dayNum = i - firstDay + 1;
            cell.dataset.day = dayNum; //store for access later

            // highlight if current selected date is this
            if (dayNum === date){
                cell.classList.add('current-cell');
            }
            // preserve active date
            if(dayNum === activeDate.getDate() ){
                cell.classList.add('active-cell');
            }
            if (dayNum < 1 || dayNum > daysInMonth){
                cell.classList.add('disabled-cell');
                if (dayNum < 1){ //previous month, offset is negative
                    cell.textContent = dayNum + getPrevMonthDate(year, month);
                }
                else if (dayNum > daysInMonth) { //offset is positive,  
                    cell.textContent = dayNum - daysInMonth ;
                }
            }
            else { //normal day within the month range
                cell.textContent = dayNum;
                const entryDate = new Date(year, month, dayNum);
                const dateKey = formatDateKey(entryDate);

                const taskList = taskStore[dateKey];

                if (taskList){ //add task dots if tasks written
                    const taskNum = taskList.length;

                    const dotWrapper = document.createElement("div");
                    dotWrapper.classList.add('dot-wrapper');
                    cell.appendChild(dotWrapper);
                    
                    for(let i=0; i<taskNum; i++){
                        const taskDot = document.createElement("div");
                        taskDot.classList.add('task-dot');
                        dotWrapper.appendChild(taskDot);
                        console.log('rendering dot for ', dayNum);
                    }
                } 
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
            // weekly view does not have different month days disabled
            cell.textContent = cellDate.getDate();
            grid.appendChild(cell);
        }
    }
}

function updateActiveDate(date){
    const month = curr_date.getMonth();
    const year = curr_date.getFullYear();
    
    activeDate = new Date(year, month, date);
    activeDateKey = formatDateKey(activeDate); //also update key
    document.querySelector('#current-date').textContent = createDateString(activeDate);
}

const cellGrid = document.querySelector("#cell-grid");
cellGrid.addEventListener('click', e => {

    const cell = e.target.closest('.day-cell');
    // day-cell not clicked!
    if (!cell) return;

    //day cell clicked, change active cell
    const prevActive = cellGrid.querySelector(".active-cell");
    
    // remove 'active-cell' calss from prevActive ONLY if it is a legal cell
    // prevActive null: nothing selected previously nothing
    // prevActive==cell: idempotent behaviour, change nothing if subsequent clicks on same cell    
    if ( prevActive && prevActive !== cell){
        prevActive.classList.remove('active-cell');
    }
    // add to latsest clicked cell
    cell.classList.add('active-cell');

    date = parseInt(cell.dataset.day, 10);
    updateActiveDate(date); //update to active date

    renderCalendar(mode, curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate());
    renderTaskPanel();
    renderTaskList();
});

function renderTaskPanel(){

    const mainWrapper = document.querySelector(".main-wrapper");
    const taskPanelWrapper = document.querySelector(".task-panel-wrapper");
    const taskPanel = taskPanelWrapper.querySelector(".task-panel");

    // load animation for 1st render of panel
    if (!taskPanel){
        mainWrapper.classList.add("panel-open");
        
        const taskPanel = document.createElement("div");
        taskPanel.classList.add("task-panel");
        
        const heading = document.createElement("h3");
        heading.classList.add("panel-date-title")
        heading.textContent = "Memo: " + createDateString(activeDate);
        
        const panelBody = document.createElement("div");
        panelBody.classList.add("panel-body")
        
        const form = document.createElement("form");
        form.setAttribute('id', 'task-form')

        const topicLabel = document.createElement("label");
        topicLabel.setAttribute('for', 'task-topic');
        topicLabel.textContent = "Topic *";
        
        const topicInput = document.createElement("input");
        topicInput.setAttribute('type', 'text');
        topicInput.setAttribute('id', 'task-topic');
        topicInput.classList.add('auto-grow');
        topicInput.required = true;
        topicInput.setAttribute('placeholder', 'Web Engineering Quiz');
        
        const descLabel = document.createElement("label");
        descLabel.setAttribute('for', 'task-desc')
        descLabel.textContent = "Description";
        
        const descInput = document.createElement('textarea');
        descInput.setAttribute('id', 'task-desc');
        descInput.classList.add('auto-grow');
        descInput.setAttribute('rows', 2);
        descInput.setAttribute('placeholder', 'Syllabus: Advanced JS and PHP');
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'save-btn';
        submitBtn.textContent = 'Save Task';
        
        form.addEventListener('submit', handleSaveTask);
        
        const taskList = document.createElement("div");
        taskList.setAttribute('id', "task-list");
        
        const line = document.createElement("hr");
        line.classList.add("line");
        
        form.append(topicLabel, topicInput, descLabel, descInput, submitBtn);
        
        //create panel with form, line and list
        panelBody.appendChild(form);
        panelBody.appendChild(line);
        panelBody.appendChild(taskList);
        
        // add heading adn panel to taskPanel
        taskPanel.appendChild(heading);
        taskPanel.appendChild(panelBody);
        
        taskPanelWrapper.appendChild(taskPanel);

        requestAnimationFrame(() => {
            taskPanel.classList.add('slide-in');
        });
    }
    //updates to already existing panel
    const heading = taskPanel.querySelector(".panel-date-title");
    if (heading) {
        heading.textContent = "Memo: " + createDateString(activeDate);
    }
    renderTaskList();
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


function renderTaskList() {
    const listContainer = document.querySelector('#task-list');
    if (!listContainer) return;
    listContainer.innerHTML = "";

    if (!activeDateKey) {
        activeDateKey = formatDateKey(activeDate);
    }
    
    const tasks = taskStore[activeDateKey] || [];
    if (tasks.length === 0) {
        
        const desc = document.createElement("p");
        desc.textContent = 'No tasks recorded for this day';
        desc.classList.add('noevent-desc');
        listContainer.append(desc);
        return;
    }
    
    tasks.forEach(task => {
        console.log("rendering lists for active date: ", activeDateKey);
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
    console.log("handleSaveTask triggered!");
    event.preventDefault();

    const topicInput = document.querySelector('#task-topic');
    const descInput = document.querySelector('#task-desc');

    const topic = topicInput.value.trim();
    const description = descInput.value.trim();

    if (!topic) return;

    if (!activeDateKey) {
        activeDateKey = formatDateKey(activeDate);
    }

    if (!taskStore[activeDateKey]) {
        taskStore[activeDateKey] = [];
    }

    taskStore[activeDateKey].push({ topic, description });

    topicInput.value = ""; //reset values at the end
    descInput.value = "";

    renderTaskList();
    renderCalendar(mode, curr_date.getFullYear(), curr_date.getMonth(), curr_date.getDate());
}