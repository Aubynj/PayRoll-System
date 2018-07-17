const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){
    const url = new URL(document.URL);
    var email = url.searchParams.get('email');

    let customersData = ipcRender.sendSync('get-customers-data', email);
    let employerDetails = customersData[0];
    let employeeId = employerDetails._id;

    let name = `${employerDetails.title} ${employerDetails.firstname} ${employerDetails.lastname}`;

    // Render data to employees dashboard
    $(".chip").html(name);
    $(".employee-name").html(name);
    $(".email").html(employerDetails.email);
    $(".sex").html(employerDetails.gender);
    $(".tel").html(employerDetails.telephone);

    redirectEdit = ()=>{
        window.location.href = "editemployee.html?id="+employeeId;
    }
    redirectEarnings = ()=>{
        window.location.href = "earnings.html?id="+employeeId;
    }

    redirectDeductions = ()=>{
        window.location.href = "deductions.html?id="+employeeId;
    }

    redirectSummary = ()=>{
        window.location.href = "summaryemployee.html?id="+employeeId;
    }
    $('.modal').modal();


    // Fetch all gross salaries
    let grossPaySalary = ipcRender.sendSync('get-all-salary-gross',employeeId);
    let earnings = ipcRender.sendSync('get-earnings', employeeId);
    let deduc = ipcRender.sendSync('get-deduct', employeeId);

    // Event for submitting gross pay
    $(".gross-form").on("submit", function(event){
        event.preventDefault();

        let grossPay = $('#gross-salary').val();
        if (grossPay == "") {
            Materialize.toast("Gross Salary is required", 4000);
        } else {
            let gross_salaries = {
                gross_salary : parseInt(grossPay),
                employeeId : employeeId
            };

            let res = ipcRender.sendSync('update-employees-gross-salary', gross_salaries);
            console.log(res);
            if (res == 0) {
                Materialize.toast("Oops... Contact Developer for issue");
            }else if (res == 1) {
                //console.log("Added");
                Materialize.toast("Gross Salary inserted successfully", 2000);
                setTimeout(()=>{
                    location.reload();
                },3000);
            }else if (res == 2) {
                Materialize.toast("Gross Salary updated successfully", 4000);
                setTimeout(()=>{
                    location.reload();
                },3000);
            }else if (res == 5) {
                Materialize.toast("Complete earning and deduction for Gross Salary to be updated", 4000);
            }
        }
    });

    if (grossPaySalary != 0) {
        $("#gross-salary").val(grossPaySalary.gross_salary);
        $("#gross").html(grossPaySalary.gross_salary);
        $("#net-salary").html(grossPaySalary.net_salary);
    }else{
        $("#gross").html("Not Available");
        $("#net-salary").html("Not Available");
    }

    if (earnings != 0 && deduc != 0) {
        $("#earnings").html(earnings);
        $("#deductions").html(deduc);
    }else{
        $("#earnings").html("Not Available");
        $("#deductions").html("Not Available")
    }

});