const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){

    const url = new URL(document.URL);
    var employeeId = url.searchParams.get('id');


    // Show earnings in fields
    let earnings = ipcRender.sendSync('get-all-earnings',employeeId);


        // Update employees data
    $(".update-earning").on('submit',function(event){
        event.preventDefault();
        var overtime = $("#overtime").val(),
            bonus = $('#bonus').val(),
            dress_allowances = $('#dress').val(),
            travel_allowances = $('#travel').val(),
            car_allowances = $('#car').val(),
            rent_allowances = $('#rent').val();

        if (overtime == "" || bonus == "" || dress_allowances == "" || travel_allowances == "" || car_allowances == "" || rent_allowances == "") {
            Materialize.toast("All fields are required", 4000);
        }else {
            let updatedEarnings = {
                overtime : parseInt(overtime),
                bonus : parseInt(bonus),
                dress_allowances : parseInt(dress_allowances),
                travel_allowances : parseInt(travel_allowances),
                car_allowances : parseInt(car_allowances),
                rent_allowances : parseInt(rent_allowances),
                employeeId : employeeId
            }

            let res = ipcRender.sendSync('update-employees-earnings', updatedEarnings);
            console.log(res);
            if (res == 0) {
                Materialize.toast("Oops... Contact Developer for issue");
            }else if (res == 1) {
                //console.log("Added");
                Materialize.toast("Employees earnings inserted successfully", 4000);
            }else if (res == 2) {
                Materialize.toast("Employees earnings updated successfully", 4000);
            }
        }
    })


    // Render earnings into fields values
    if (earnings[0] != undefined) {
        $("#overtime").val(earnings[0].overtime);
        $("#bonus").val(earnings[0].bonus);
        $("#dress").val(earnings[0].dress_allowances);
        $("#travel").val(earnings[0].travel_allowances);
        $("#car").val(earnings[0].car_allowances);
        $("#rent").val(earnings[0].rent_allowances);
    }
    

    goBack = ()=>{
        window.history.go(-1);
    }
})