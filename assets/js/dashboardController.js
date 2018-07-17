
const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){
    let customers = {};
    let admin_id = localStorage.getItem("_id");

    // This is the event for realTime search
    ipcRender.on('fetch-customers-reply',(event, customersData)=>{
        //console.log(customersData);
        for(let index = 0; index < customersData.length; index++){
            // Get all necessary customers names
            CustomersName = `${customersData[index].title} ${customersData[index].firstname} ${customersData[index].lastname} ${customersData[index].email}`;
            let uniqueId = customersData[index].email;
            customers[CustomersName] = null;
        }
        $('input.autocomplete').autocomplete({
            data : customers,
            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                // Callback function when value is autcompleted.
                let data = val.split(" ");
                emailData = data[3];
                window.location.href = 'customers.html?email='+data[3];
                url = document.URL;
                console.log(emailData);
            },
            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
        });
    });
    
    ipcRender.send('fetch-customers-event','get-me-all-customers');

    $('.modal').modal();
    
    // Count Employees
    let num = null;
    let count = ipcRender.sendSync('count-employee',num);
    if (count == 0) {
        $(".countEmployees").html("no");
    }else {
        $(".countEmployees").html(count);
    }


    // Get admin Access point and restrict TASK
    let adminInformation = ipcRender.sendSync('get-admin-info', admin_id);
    // Assign access token to adminAccess
    let adminAccess = adminInformation.access;

    if (adminAccess == 0 || adminAccess == undefined){
        document.getElementById('operator').href = 'javacript:void()';
        document.getElementById('modal-operator').href = 'javascript:void()';
        $(".fixed-action-btn").html("Restricted Account");

        // Ensure that token access with 0 are disabled
        $('#float-employe').attr('disabled','disabled');
        $("#operator").on("click", function(event){
            event.preventDefault();
            Materialize.toast("Access restricted to create Admin account", 4000);
        });

        $("#modal-operator").on("click", function(event){
            event.preventDefault();
            Materialize.toast("Access restricted to alter employees details", 4000);
        });
    }
    
    logout = ()=>{
        localStorage.clear();
        window.location.href = "index.html";
    }
})