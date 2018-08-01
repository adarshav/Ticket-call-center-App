var countHandle = document.getElementById('count');
var tableBodyHandle = document.getElementById('tableBody');
var formHandle = document.getElementById('ticketForm');
var nameHandle = document.getElementById('name');
var departmentHandle = document.getElementById('department');
var priorityHandle = document.getElementById('priority');
var priorityNames = document.getElementsByName('priority');
var messageHandle = document.getElementById('message');
// var allHandle = document.getElementById('all');
// var highHandle = document.getElementById('highselect');
// var mediumHandle = document.getElementById('mediumselect');
// var lowHandle = document.getElementById('lowselect');
var searchHandle = document.getElementById('search');
var all = document.getElementById('all');
var high = document.getElementById('high');
var medium = document.getElementById('medium');
var low = document.getElementById('low');
var selectHandle = document.getElementById('select');

var tickets;

function buildRow(ticket) {
    var tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td>
        <td>${ticket.status}</td>
        `;
    tableBodyHandle.appendChild(tr);
}



function getTickets() {
    axios.get('http://dct-api-data.herokuapp.com/tickets?api_key=bdf700508f5c5153')
.then(function(response) {
     tickets = response.data;
    countHandle.innerHTML = tickets.length;
    tickets.forEach(function(ticket) {
        buildRow(ticket);
    });

})
.catch(function(error) {
    console.log(error);
})
}


window.addEventListener('load', function() {
    getTickets()
}, false);

function getPriorityValue() {
    for(var i = 0;i < priorityNames.length;i++) {
        if(priorityNames[i].checked) {
            return priorityNames[i].value;
        }
    }
}

function filterTickets(priority) {
    tableBodyHandle.innerHTML = '';
    var count = 0;
    tickets.forEach(function(ticket) {
        if(ticket.priority === priority) {
            count++;
            buildRow(ticket);

        }
    });
    countHandle.innerHTML = count;
}

searchHandle.addEventListener('keyup', function() {
    tableBodyHandle.innerHTML = '';
    var searchResults = tickets.filter(function(ticket) {//it searchs on the code, name, department, priority
        // return ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0;
        return ticket.name.toLowerCase().includes(searchHandle.value.toLowerCase()) || 
        ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0 ||
        ticket.department.toLowerCase().includes(searchHandle.value.toLowerCase()) ||
        ticket.priority.toLowerCase().includes(searchHandle.value.toLowerCase());
    });
    searchResults.forEach(function(ticket) {
        buildRow(ticket);
    });
    countHandle.innerHTML = searchResults.length;
}, false);

// high.addEventListener('click', function() {
//     filterTickets('high');
// }, false);

// medium.addEventListener('click', function() {
//     filterTickets('medium');
// }, false);
// low.addEventListener('click', function() {
//     filterTickets('low');
// }, false);
// all.addEventListener('click', function() {
//     getTickets();
// }, false);

selectHandle.addEventListener('change', function() {
    if(selectHandle.value === 'high') {
        filterTickets('high');
    } else if(selectHandle.value === 'medium') {
        filterTickets('medium');
    } else if(selectHandle.value === 'low') {
        filterTickets('low');
    } else {
        getTickets();
    }
}, false);

formHandle.addEventListener('submit', function(e) {
    e.preventDefault();

    var formData = {
        name:nameHandle.value,
        department:departmentHandle.value,
        priority:getPriorityValue(),
        message:messageHandle.value
    }

    axios.post('http://dct-api-data.herokuapp.com/tickets?api_key=bdf700508f5c5153', formData)
    .then(function(response) {
        var ticket = response.data;
        console.log(ticket);
        buildRow(ticket);
        countHandle.innerHTML = parseInt(countHandle.innerHTML) + 1;
        formHandle.reset();
    })
    .catch(function(error) {
        console.log(error);
    })
}, false);

// function filterTickets(priority) {
//     tableBodyHandle.innerHTML = '';
//     var count;
//     tickets.forEach(function(ticket) {
//         if(ticket.priority === priority) {
//             count++;
//             buildRow(ticket);
//         }
//     });
//     countHandle.innerHTML = count;
// }
