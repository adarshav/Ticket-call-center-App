var countHandle = document.getElementById('count');
var formHandle = document.getElementById('ticketForm');
var tableBodyHandle = document.getElementById('tableBody');

var nameHandle = document.getElementById('name');
var nameErrorHandle = document.getElementById('nameError');

var departmentHandle = document.getElementById('department');
var departmentErrorHandle = document.getElementById('departmentError');

var priorityHandle = document.getElementById('priority');
var priorityNames = document.getElementsByName('priority');

var messageHandle = document.getElementById('message');
var messageErrorHandle = document.getElementById('messageError');

var all = document.getElementById('All');
var high = document.getElementById('high');
var medium = document.getElementById('medium');
var low = document.getElementById('low');

var tickets;

function buildRow(ticket) {
    var tr =document.createElement('tr');

    tr.innerHTML = `
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td>
        `;
    tableBodyHandle.appendChild(tr);
}
axios.get("http://dct-api-data.herokuapp.com/tickets?api_key=bdf700508f5c5153")
.then(function(response) {
    var tickets = response.data;
    countHandle.innerHTML = tickets.length;
    tickets.forEach(function(ticket) {
        buildRow(ticket);
    }); 
})
.catch(function (error) {
    console.log(error);
})
//to insert in the priority field to check whether it is true or not
function getPriorityValue() {
    console.log(priorityHandle);
    for(var i = 0;i < priorityNames.length;i++) {
        if(priorityNames[i].checked === true) {
            return priorityNames[i].value;
        }
    }
}
//object of errors for the clientside validation
var hasErrors = {
    name:true,
    department:true,
    priority:true,
    message:true
};
function validateName() {
    if(nameHandle.value == '') {
        nameErrorHandle.innerHTML = 'name cannot be blank';
        hasErrors.name = true;
    } else {
        nameErrorHandle.innerHTML = '';
        hasErrors.name = false;
    }
}

function validateDepartment() {
    if(departmentHandle.value === 'select') {
        departmentErrorHandle.innerHTML = '*required';
        hasErrors.department = true;
    } else {
        departmentErrorHandle.innerHTML = '';
        hasErrors.department = false;
    }
}

function validateMessage() {
    if(messageHandle.value = '') {
        var text = document.createTextNode('message cannot be blank');
        messageErrorHandle.appendChild(text);
        //messageErrorHandle.innerHTML = 'cannot be blank';
        hasErrors.message = true;
    } else {
        messageErrorHandle.innerHTML = '';
        hasErrors.message = false;
    }
}
formHandle.addEventListener('submit', function(e) {
    validateName();
    validateDepartment();
    validateMessage();

    if(Object.values(hasErrors).includes(true)) {
        e.preventDefault();
    }
   

    var formData = {
        name:nameHandle.value,
        department:departmentHandle.value,
        priority:getPriorityValue(),
        message:messageHandle.value
    }

    
}, false)
