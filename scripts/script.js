let state_list = null;

async function  run(){
    await getStateList(); //get states
    let location_quakes_response = await fetchFromApi(); //get locations
    let location_quakes_html = location_quakes_response.features.map(transformToHtml) //build a card html for each location
    insertHtml(location_quakes_html) //indert htmls into the document
}

function fetchFromApi(){
    var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    return $.get(queryUrl)

}


/**
 * @description convert each location to html
 * @param {*} location_quake 
 * @returns 
 */
function transformToHtml(location_quake,index){
    return `
    

    <div class="content-item" id="location--${index}" data-location-name="${location_quake?.properties.place}">
        <div class="location-info">
            <div class="row">
                <div class="location-name">${location_quake?.properties?.place}</div>
                <div class="location-intensity">earth quake intensity: <span class="intensity">${location_quake?.properties?.mag}</span></div>
            </div>
            <div class="row">
                <div class="location-time">Time logged: <span class="time-logged">${new Date(location_quake?.properties?.time).toLocaleString()}</span></div>
            </div>
            <div class="row">
                <div class="location-action">
                    <button onClick='seeHistogram("${getStateName(location_quake?.properties?.place)}","location--${index}")'>See history</button>
                </div>
            </div>
        </div>
    </div>`
}

/**
 * @description insert all new location html into the page-content
 * @param {*} location_quakes_html array of html template for each location
 */
function insertHtml(location_quakes_html){
    document.querySelector('.page-content').innerHTML = location_quakes_html.join("")
}


async function seeHistogram(state_code,element_id){
    if (!(typeof state_code == 'string') || state_code == "null") {
        alert('not a USA state')
        return
    }

    removePreviousChart();
    addLocationChart(element_id)
    console.log('histogram clicked')
    //document.querySelector('.page-content').classList.toggle('hide')


    //  calculate histogram data
     let history = await fetchFromApi() //call api
     history = history.features //get features
     history = history.filter((feature) => { //find futures with our state code
     return feature.properties.place.includes(state_code)
     } )
     history = history.map((feature) => { //get time time of each activity
     const datetime = new Date(feature?.properties?.time).toLocaleString() 
     return datetime.substring(0, datetime.indexOf(","))

     })
     
     // compute frequency of occurence for each our state location
     history = history.reduce((acc, _date) => {
     return {
         ...acc,
         [_date] : acc[_date]? acc[_date] + 1 : 1 
     }
     
     }, {})

     //end histogram data culculation
     
    console.log(history)
    renderChartInfo(history)
    // showGraph(history)
}


function removePreviousChart(){
    document.querySelector('#earth_chart')?.remove();
}


function addLocationChart(id){
    
    document.querySelector(`#${id} .location-info`).innerHTML += `
        <div class="row" id="earth_chart">
            <canvas id="myChart" width="400" height="300"></canvas>
        </div>
    `
}


function renderChartInfo(data){
    var ctx = document.getElementById('myChart').getContext('2d');
   
var myChart = new Chart(ctx, {
    type: 'bar',
    responsive: true,
    maintainAspectRatio: true,
    data: {
        labels: Object.keys(data).reverse(),
        datasets: [{
            label: '# of Votes',
            data: Object.values(data).reverse(),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

/**
 * 
 * @param {*} _string data that may contain state name within a longer string
 */
function getStateName(_string){
    console.log('looking for state code for place:',_string)
    
    let _state_name = (_string.split(',').length ===2) ?_string.split(/,/,2)[1].trim() : _string

    if (_state_name.length === 2) {
        console.log('state already present =================>>>>>>>>>>>',_state_name)
        return _state_name
    }

    let [found] = state_list.filter((ith_state) =>{
        return _state_name.toLowerCase().includes(ith_state[1].toLowerCase())
    })

    console.log('matching state',found)

    return (found instanceof Array)? found[1].trim() : _string;
}

function showGraph(history){
    // parse and then show history on the screen
}


function getStateList(){
    return $.get('./scripts/statelist.js').then(data => state_list = JSON.parse(data))
}

/**
 * 
 * @param {*} shouldShowAll if true show all locations else hide those that do not match
 */

function filterLocations(shouldShowAll=false){
    let nodes = Array.from(document.querySelectorAll('.content-item'))
    if (shouldShowAll){
        nodes.forEach(node => node.classList.remove('hide'))
        
    }else {
        nodes.forEach(node => node.classList.remove('hide'))
        let query = document.querySelector('input').value.toLocaleLowerCase().trim()
        //get non matching location
        let non_matching = nodes.filter (node => !(node.getAttribute('data-location-name').toLowerCase().trim().includes(query))  )
        non_matching.forEach(node => node.classList.add('hide'))
    }


}

run()
