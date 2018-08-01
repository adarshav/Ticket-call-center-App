var baseUrl = 'http://dct-api-data.herokuapp.com'
var key = '671a7695f19b162f';

var countHandle = document.getElementById('count');
var tableBodyHandle = document.getElementById('tableBody');
var ticketFormHandle = document.getElementById('ticketForm'); 

var nameHandle = document.getElementById('name');
var departmentHandle = document.getElementById('department');
var priorityHandle = document.getElementById('priority');
var priorityNames = document.getElementsByName('priority'); 
var messageHandle = document.getElementById('message'); 

var allHandle = document.getElementById('all');
var highHandle = document.getElementById('high');
var mediumHandle = document.getElementById('medium');
var lowHandle = document.getElementById('low');

var searchHandle = document.getElementById('search');

var tickets; 

function filterTickets(priority){
    tableBodyHandle.innerHTML = '';
    var count = 0;
    tickets.forEach(function (ticket) {
        if (ticket.priority === priority) {
            count++;
            buildRow(ticket);
        }
    });
    countHandle.innerHTML = count; 
}
// code for searching done by Code
searchHandle.addEventListener('keyup',function(){
   tableBodyHandle.innerHTML = '';
   var searchResults = tickets.filter(function(ticket){
        return ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0;
   });

   searchResults.forEach(function(ticket){
        buildRow(ticket); 
   })
   countHandle.innerHTML = searchResults.length; 
}, false);


highHandle.addEventListener('click', function(){
 filterTickets('High');
}, false); 

mediumHandle.addEventListener('click', function(){
  filterTickets('Medium');
}, false);

lowHandle.addEventListener('click', function(){
    filterTickets('Low');
}, false);

allHandle.addEventListener('click', function () {
    tableBodyHandle.innerHTML = '';
    tickets.forEach(function (ticket) {
        buildRow(ticket);
    });
    countHandle.innerHTML = tickets.length;
}, false);

function buildRow(ticket){
    var tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td> 
    `;
    tableBodyHandle.appendChild(tr); 
}

function getTickets() {
    axios.get(`${baseUrl}/tickets?api_key=${key}`)
        .then(function (response) {
            tickets = response.data;
            countHandle.innerHTML = tickets.length;
            tickets.forEach(function (ticket) {
                buildRow(ticket);
            })
        })
        .catch(function (err) {
            console.log(error);
        });
}


function getPriorityValue(){
    for(var i = 0; i < priorityNames.length; i++) {
        if(priorityNames[i].checked){
            return priorityNames[i].value; 
        }
    }
}

ticketFormHandle.addEventListener('submit', function(e){
    e.preventDefault(); 
    var formData = {
        name: nameHandle.value,
        department: departmentHandle.value,
        priority: getPriorityValue(),
        message: messageHandle.value 
    }; 

    axios.post(`${baseUrl}/tickets?api_key=${key}`, formData)
    .then(function(response){
        var ticket = response.data; 
        buildRow(ticket); 
        countHandle.innerHTML = parseInt(countHandle.innerHTML) + 1; 
        ticketFormHandle.reset(); 
    })
    .catch(function(err){
        console.log(err); 
    })

}, false); 

window.addEventListener('load', function(){
    // console.log('page has been loaded')
    getTickets(); 
}, false);
