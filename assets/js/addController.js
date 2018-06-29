const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){
    $(".add-form").on('submit',function(event){
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
            let addData = {
                title : title,
                firstname : capitalizeFirstLetter(firstname),
                lastname : capitalizeFirstLetter(lastname),
                email : email,
                telephone : telephone,
                date : date,
                gender : gender
            }

            let res = ipcRender.sendSync('addCustomers-event', addData);
            console.log(res);
            if (res == 0) {
                Materialize.toast("Oops... There is problem adding customers");
            }else if (res.firstname) {
                console.log("Added");
                Materialize.toast(`${res.title} ${res.firstname}  has been added successfully`, 4000);
                $('.add-form')[0].reset();
            }
        }
    })

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
      });

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
})