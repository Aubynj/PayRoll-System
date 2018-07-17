const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){
const url = new URL(document.URL);
var employee_id = url.searchParams.get('id');

//console.log(url);
let customersData = ipcRender.sendSync('get-customers-data-id', employee_id);
let employerDetails = customersData[0];
let employeeId = employerDetails._id;

//console.log(employerDetails);
// Render data to employees dashboard

// // Render data to editemployees
$("#title").val(employerDetails.title),
$('#first_name').val(employerDetails.firstname),
$('#last_name').val(employerDetails.lastname),
$('#email').val(employerDetails.email),
$('#tel').val(employerDetails.telephone),
$('#date').val(employerDetails.date),
$('#gender').val(employerDetails.gender);


// Update employees data
$(".update-form").on('submit',function(event){
    event.preventDefault();
    var title = $("#title").val(),
        firstname = $('#first_name').val(),
        lastname = $('#last_name').val(),
        email = $('#email').val(),
        telephone = $('#tel').val(),
        date = $('#date').val(),
        gender = $('#gender').val();

    if (title == null || firstname == "" || lastname == "" || email == "" || telephone == "" || date == "" || gender == null) {
        Materialize.toast("All fields are required", 4000);
    }else {
        let updatedData = {
            title : title,
            firstname : capitalizeFirstLetter(firstname),
            lastname : capitalizeFirstLetter(lastname),
            email : email,
            telephone : telephone,
            date : date,
            gender : gender,
            _id : employeeId
        }

        let res = ipcRender.sendSync('update-employees-event', updatedData);
        //console.log(res);
        if (res == 0) {
            Materialize.toast("Oops... There is problem updating employee");
        }else if (res == 1) {
            //console.log("Added");
            Materialize.toast("Employees information updated successfully", 4000);
        }
    }
})


//Date picker
$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });

//   function to capitalize first character of a text or word
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  backHome = ()=>{
      window.history.go(-1);
  }
});
