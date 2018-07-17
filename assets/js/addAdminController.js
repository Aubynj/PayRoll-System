const electron = require('electron');
const ipcRender = electron.ipcRenderer;


// Begin login scripts shere
$(".admin-account").on("submit",(event)=>{
    event.preventDefault();
    let access = 0;
    var firstname = $("#first_name").val(),
        lastname = $("#last_name").val(),
        email = $("#email").val(),
        password = $("#password").val(),
        chek = document.getElementById("access").checked;

    if (email == "" || password == "" || firstname == "" || lastname == ""){
        Materialize.toast('All fields are required', 4000)
    }else{
    
        if (chek == true) {
            access = 1;
        }else if(chek == false) {
            access = 0;
        }

        let data = {
            firstname : firstname,
            lastname : lastname,
            email : email.toLowerCase(),
            password : password,
            access : parseInt(access)
        }

        let res = ipcRender.sendSync('create-event', data);
        if (res == 0) {
            Materialize.toast("Email already exist");
        }else if (res == 1) {
            Materialize.toast("Oops... There is problem creating account");
        }else if (res.email) {
            Materialize.toast("Success. Please wait...", 5000);
            $("#first_name").attr('disabled','disabled');
            $("#last_name").attr('disabled','disabled');
            $("#email").attr('disabled','disabled');
            $("#password").attr('disabled','disabled');
            $("#access").attr('disabled','disabled');
            $('.btn-large').attr('disabled','disabled');
            setTimeout(function(){
                window.location.href = 'dashboard.html';
            },4000)
        }
   }
})

