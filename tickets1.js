var baseUrl = 'http://dct-api-data.herokuapp.com'
var key = 'adaed46e71037faa';

var tickets;

function filterTickets(priority){
    tableBodyHandle.innerHTML = '';
    var count = 0;
    tickets.forEach(function(ticket){
        console.log(ticket.priority);
        if(ticket.priority == priority){
        //console.log(ticket.priority);    
            count++;
            buildRow(ticket);
        }
    });
    countHandle.innerHTML = count;
}

var all = document.getElementById('All');
all.addEventListener('click', function(){
        console.log('you clicked all');
},false);

var low = document.getElementById('low');
low.addEventListener('click', function(){
    filterTickets(low);
},false);

var medium = document.getElementById('medium');
medium.addEventListener('click', function(){
    filterTickets(medium);
},false);

var high = document.getElementById('high');
high.addEventListener('click', function(){
    console.log('clicked high');
    filterTickets(High);
},false);

var countHandle = document.getElementById('count');
var tableBodyHandle = document.getElementById('tableBody');
var ticketFormHandle = document.getElementById('ticketForm'); 

var nameHandle = document.getElementById('name');
var departmentHandle = document.getElementById('department');
var priorityHandle = document.getElementById('priority');
var priorityNames = document.getElementsByName('priority'); 
var messageHandle = document.getElementById('message'); 
var searchHandle = document.getElementById('search');

searchHandle.addEventListener('keyup', function() {
    tableBodyHandle.innerHTML = '';
    var searchResults = tickets.filter(function(ticket) {
        return ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0;
        //we are converting the ticket-code into lowercase and 
    });
    searchResults.forEach(function(ticket) {
        buildRow(ticket);
    });
    countHandle.innerHTML = searchResults.length;
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

function getTickets(){
    axios.get(`${baseUrl}/tickets?api_key=${key}`)
    .then(function(response){
    tickets = response.data; 
    countHandle.innerHTML = tickets.length; 
    tickets.forEach(function(ticket){
        buildRow(ticket); 
    })
})
    .catch(function(err){

    })
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

    console.log(formData); 
}, false); 

window.addEventListener('load', function(){
    getTickets();
}, false);

