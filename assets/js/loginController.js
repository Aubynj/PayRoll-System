const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){
    // Begin login scripts shere
    $(".progress").hide();
    $(".login-form").on("submit",(event)=>{
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val()

        if (email == "" || password == ""){
            Materialize.toast('Email/Password combination is incorrect', 4000)
        }else{
            var data = {
                email : email,
                password : password
            };

            let result = ipcRender.sendSync('login-event', data);
            if (result === null) {
                Materialize.toast("Oops... Email/Password is incorrect", 4000);
            }else if(result != null){
                localStorage.setItem("_id" , result._id);
                Materialize.toast("Successfully login. Please wait...");
                $(".progress").show();
                $("#email").attr('disabled','disabled');
                $("#password").attr('disabled','disabled');
                $("#login").attr('disabled','disabled');
                setTimeout(function(){
                    window.location.href = 'dashboard.html';
                },3000);
            }
            
        }
    })
})