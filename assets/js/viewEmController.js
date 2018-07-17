const electron = require('electron');
const notifier = require('node-notifier');
const path = require('path');
const ipcRender = electron.ipcRenderer;


fetchAllDataTable();
// Function to fetch all data into tables
function fetchAllDataTable(){
    ipcRender.on('get-me-all-data-reply', (event, data)=>{
        let count = 1;
        let template = `
                <table class="responsive-table  highlight">
                    <thead style="font-weight:bold">
                        <tr>
                            <td>ID</td>
                            <td>Full name</td>
                            <td>Gender</td>
                            <td>Email</td>
                            <td>Telephone</td>
                            <td>Gross Salary</td>
                            <td>Net Salary</td>
                        </tr>
                    </thead>
                <tbody>`;

        //console.log(data);
        for(let i = 0; i < data.length; i++) {
            let id = JSON.stringify(data[i]);
            let fullname = `${data[i].firstname} ${data[i].lastname}`;
            
            // Make server request for salaries
            let subsequentSalary = ipcRender.sendSync('get-me-subsequent-salary', data[i]._id);
            console.log(subsequentSalary);
            let gross = subsequentSalary.gross_salary;
            let net =  subsequentSalary.net_salary;

            if (net == undefined || gross == undefined) {
                net = "Not available";
                gross = "Not available";
            }

            template += `
                    <tr>
                        <td>${count}</td>
                        <td>${fullname}</td>
                        <td>${data[i].gender}</td>
                        <td>${data[i].email}</td>
                        <td>${data[i].telephone}</td>
                        <td>${gross}</td>
                        <td>${net}</td>
                    </tr>
          
            `;
            count += 1;
        }
        template += `
                </tbody>
                </table>        
        `;

        $(".fetch-table").html(template);
    })
    ipcRender.send('get-me-all-data', 'fetching-all-employees');
};




printFunction = ()=>{
    $("#print-summary,#back").hide();
    window.print();
    notifier.notify(
        {
          title: 'Payroll System',
          message: 'Employee summary printed successfully',
          icon: path.join(__dirname, '/assets/images/Payroll.png'), // Absolute path (doesn't work on balloons)
          sound: true, // Only Notification Center or Windows Toasters
        }, function(err, response){
            playNotificationAlert();
        });
    setTimeout(()=>{
        $("#print-summary,#back").show();
    },2000);
}

dashboardBack = ()=>{
    window.history.go(-1);
}

playNotificationAlert =()=>{
    let song = path.join(__dirname, '/assets/song/arpeggio.mp3');
    let audio = new Audio(song);
    audio.play();
}

