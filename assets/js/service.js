var remote = require('electron').remote;


document.addEventListener('keydown', (e)=>{
    if(e.which === 123 ){
        remote.getCurrentWindow().webContents.openDevTools();
    }else if(e.which === 116){
        location.reload();
    }
})