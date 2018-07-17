const electron = require('electron');
const ipcRender = electron.ipcRenderer;

$(function(){

    const url = new URL(document.URL);
    var employeeId = url.searchParams.get('id');


    

    

    summaryBack = ()=>{
        window.history.go(-1);
    }
})