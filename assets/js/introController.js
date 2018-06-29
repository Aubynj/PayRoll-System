const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(window).load(function(){
    $(".intro-lock").hide();
    intro();
})

setTimeout(function(){
    $(".intro-lock").show();
},2000);

$(".progress").hide();

// Introduction method  
function intro(){
    ipcRender.on('intro-check-reply',(event,data)=>{
        console.log(data.length);
        if (data.length > 0){
            window.location.href = 'index.html';
        }
    })
    ipcRender.send('intro-check-message','Give-feedback');
}

$(".intro-lock").show();
// Begin login scripts shere
$(".intro-form").on("submit",(event)=>{
    event.preventDefault();

    var firstname = $("#first_name").val();
    var lastname = $("#last_name").val()
    var email = $("#email").val();
    var password = $("#password").val()

    if (email == "" || password == "" || firstname == "" || lastname == ""){
        Materialize.toast('All fields are required', 4000)
    }else{
        var data = {
            firstname : firstname,
            lastname : lastname,
            email : email,
            password : password
        }

        let res = ipcRender.sendSync('create-event', data);
        if (res == 0) {
            Materialize.toast("Email already exist");
        }else if (res == 1) {
            Materialize.toast("Oops... There is problem creating account");
        }else if (res.email) {
            localStorage.setItem('_id', res._id);
            $(".progress").show();
            Materialize.toast("Success. Please wait...", 5000);
            $("#first_name").attr('disabled','disabled');
            $("#last_name").attr('disabled','disabled');
            $("#email").attr('disabled','disabled');
            $("#password").attr('disabled','disabled');
            $('.btn-large').attr('disabled','disabled');
            setTimeout(function(){
                window.location.href = 'index.html';
            },4000)
        }

    }
})

