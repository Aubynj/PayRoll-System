const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){

    const url = new URL(document.URL);
    var employeeId = url.searchParams.get('id');


    // Show deduction in fields
    let deduction = ipcRender.sendSync('get-all-deduction',employeeId);


        // Update employees data
    $(".update-deduction").on('submit',function(event){
        event.preventDefault();
        var ssnit_tax = $("#ssnit_tax").val(),
            income_tax = $('#income_tax').val(),
            loans = $('#loan').val(),
            other_deduction = $('#other').val();

        if (ssnit_tax == "" || income_tax == "" || loans == "" || other_deduction == "") {
            Materialize.toast("All fields are required", 4000);
        }else {
            let updatedDeductions = {
                ssnit_tax : parseInt(ssnit_tax),
                income_tax : parseInt(income_tax),
                loans : parseInt(loans),
                other_deduction : parseInt(other_deduction),
                employeeId : employeeId
            }

            let res = ipcRender.sendSync('update-employees-deductions', updatedDeductions);
            console.log(res);
            if (res == 0) {
                Materialize.toast("Oops... Contact Developer for issue");
            }else if (res == 1) {
                //console.log("Added");
                Materialize.toast("Employees deductions inserted successfully", 4000);
            }else if (res == 2) {
                Materialize.toast("Employees deductions updated successfully", 4000);
            }
        }
    })


    // Render earnings into fields values
    if (deduction[0] != undefined) {
        $("#ssnit_tax").val(deduction[0].ssnit_tax);
        $("#income_tax").val(deduction[0].income_tax);
        $("#loan").val(deduction[0].loans);
        $("#other").val(deduction[0].other_deduction);
    }
    

    dedback = ()=>{
        window.history.go(-1);
    }
})