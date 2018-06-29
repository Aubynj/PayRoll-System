
const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){
    let customers = {};

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
    
    

})