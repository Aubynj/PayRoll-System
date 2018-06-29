// Let require all the electron methods
const { app, BrowserWindow, ipcMain} = require('electron');
const database = require('./Database/database');
const url = require('url');
const path = require('path');
// Let initialise window object
let win;

// Function to hold window
function createWindow(){
    win = new BrowserWindow({
        height : 738,
        width : 1300,
    })

    win.loadURL(url.format({
        pathname : path.join(__dirname, 'intro.html'),
        protocol : 'file',
        slashes : true
    }))

    win.on('closed', ()=>{
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
  
app.on('activate', () => {	
	// On macOS it's common to re-create a window in the app when the		
	// dock icon is clicked and there are no other windows open.		
	if (win === null) {
		createWindow()		
	}
})

// Render all the ipcMain methods here
// Let begin insecting intro
ipcMain.on('create-event', (event, data)=>{
	// Check if email exist
	let email = data.email;
	database.administrator.findOne({email: email},function(error,length){
		if (length < 1){
			// Email doesn't exist
			database.administrator.insert(data,function(error, doc){
				if (doc){
					console.log(doc);
					event.returnValue = doc;
				}else{
					event.returnValue = 1;
				}
			})
		} else {
			event.returnValue = 0;
		}
	})
})

// Event method for checking for intro request
ipcMain.on('intro-check-message',(event,res)=>{
	database.administrator.find({},function(err, doc){
		console.log(doc)
		event.sender.send('intro-check-reply', doc);
	})
});

// Event for checking of login credentials
ipcMain.on('login-event', (event, res)=>{
	database.administrator.findOne({email: res.email, password: res.password},function(err,len){
		event.returnValue = len;
	})
})

// Event for add customers
ipcMain.on('addCustomers-event', (event, addData)=>{
	console.log(addData);
	database.customers.insert(addData, function(err, doc){
		if (doc) {
			event.returnValue = doc;
		} else {
			event.returnValue = 0;
		} 
	})
})

// Event for fetching all customers
ipcMain.on('fetch-customers-event',(event,res)=>{
	database.customers.find({},function(err, doc){
		if (doc) {
			event.sender.send('fetch-customers-reply', doc);
		} else {
			event.sender.send('fetch-customers-reply','Empty customers data');
		}
	})
})