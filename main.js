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
		icon : __dirname+'/assets/images/Payroll.png'
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
					//console.log(doc);
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
		//console.log(doc)
		event.sender.send('intro-check-reply', doc);
	})
});

// Event for checking of login credentials
ipcMain.on('login-event', (event, res)=>{
	database.administrator.findOne({email: res.email, password: res.password},function(err,len){
		event.returnValue = len;
	})
})

// Event for getting admin details
ipcMain.on('get-admin-info', (event, adminID)=>{
	database.administrator.findOne({_id : adminID}, function(err, len){
		event.returnValue = len;
	})
})

// Adding Administrator Account
ipcMain.on('add-admin-account', (event,adminData)=>{
	database.administrator.insert(adminData, function(err, doc){
		if (doc) {
			event.returnValue = doc;
		} else {
			event.returnValue = 0;
		}
	})
})

// Event for add customers
ipcMain.on('addCustomers-event', (event, addData)=>{
	//console.log(addData);
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

// Event for getting all employees
ipcMain.on('get-customers-data', (event,res)=>{
	database.customers.find({email:res}, function(err, doc){
		if (doc) {
			event.returnValue = doc;
		}
	})
})

// Event for getting employee for edit
ipcMain.on('get-customers-data-id', (event,res)=>{
	database.customers.find({_id:res}, function(err, doc){
		if (doc) {
			event.returnValue = doc;
		}
	})
})

// Event for updating employees
ipcMain.on('update-employees-event',(event,res)=>{
	//console.log(res);
	database.customers.update({ _id: res._id }, {$set : { title : res.title, firstname: res.firstname, lastname:res.lastname, email:res.email, date:res.date, telephone:res.telephone} }, {} ,function(err,numrep){
		if (numrep) {
			event.returnValue = 1;
			database.customers.persistence.setAutocompactionInterval(100);
		} else if(err) {
			event.returnValue = 0;
		}
		//console.log(numrep);
		//console.log(err);
	})
})

// Get employees count
ipcMain.on('count-employee', (event,res)=>{
	database.customers.count({}, function(err, count){
		event.returnValue = count;
	})
})

// Event for updating employees earnings
ipcMain.on('update-employees-earnings', (event,earningData)=>{
	database.earnings.findOne({employeeId : earningData.employeeId}, function(err,  doc){
		if (doc == null) {
			// EmployeeId doesn't Exists
			database.earnings.insert(earningData, function(err, inserted){
				if (inserted) {
					event.returnValue = 1;
				} else {
					event.returnValue = 0;
				}
			})
		}
		if (doc) {
			database.earnings.update({employeeId : earningData.employeeId},{$set : {
				overtime: earningData.overtime,
				bonus: earningData.bonus,
				dress_allowances: earningData.dress_allowances,
				travel_allowances: earningData.travel_allowances,
				car_allowances : earningData.car_allowances,
				rent_allowances: earningData.rent_allowances
			}},{}, function(err, num){
				if (num) {
					event.returnValue = 2;
					database.earnings.persistence.setAutocompactionInterval(100);
				}else if (err) {
					event.returnValue = 0;
				}
			})
		}
	})
})


// Event to add deductions
// Event for updating employees earnings
ipcMain.on('update-employees-deductions', (event,deductionData)=>{
	database.deductions.findOne({employeeId : deductionData.employeeId}, function(err,  doc){
		if (doc == null) {
			// EmployeeId doesn't Exists
			database.deductions.insert(deductionData, function(err, inserted){
				if (inserted) {
					event.returnValue = 1;
				} else {
					event.returnValue = 0;
				}
			})
		}
		if (doc) {
			database.deductions.update({employeeId : deductionData.employeeId},{$set : {
				ssnit_tax: deductionData.ssnit_tax,
				income_tax: deductionData.income_tax,
				loans: deductionData.loans,
				other_deduction: deductionData.other_deduction,
			}},{}, function(err, num){
				if (num) {
					event.returnValue = 2;
					database.deductions.persistence.setAutocompactionInterval(100);
				}else if (err) {
					event.returnValue = 0;
				}
			})
		}
	})
})

// Get all earnings and updates
ipcMain.on('get-all-earnings', (event, id)=>{
	database.earnings.find({employeeId : id}, function (err, data){
		if (data) {
			event.returnValue = data;
		}
	})
})

// Get all deduction and updates
ipcMain.on('get-all-deduction', (event, id)=>{
	database.deductions.find({employeeId : id}, function (err, data){
		if (data) {
			event.returnValue = data;
		}
	})
})


// Event to field the salary
ipcMain.on('update-employees-gross-salary', (event, grossSalary)=>{
	// Let get deduction and calculate tax
	database.deductions.findOne({employeeId : grossSalary.employeeId}, function(err, deducData){
		if (deducData == null) {
			event.returnValue = 5;
		} else {
			let incomeTax = calculateIncomeTax(deducData.income_tax, grossSalary.gross_salary);
			let ssnitTax =  calculateSsnitTax(deducData.ssnit_tax, grossSalary.gross_salary);

			database.earnings.findOne({employeeId: grossSalary.employeeId}, function(err, earnings){
				if (earnings == null) {
					event.returnValue = 5;
				} else {
						// Get final earnings
					let finalEarnings = calculateFinalEarnings(
						earnings.overtime, earnings.bonus, earnings.dress_allowances, earnings.car_allowances,
						earnings.rent_allowances, earnings.travel_allowances);
					// Get final net salary
					let finalNetSalary = calculateNetSalary(
						incomeTax, ssnitTax, deducData.loans, deducData.other_deduction, finalEarnings,grossSalary.gross_salary);

					// Make insertion into database
					database.salaries.findOne({employeeId : grossSalary.employeeId}, function(err,  doc){
						if (doc == null) {
							// EmployeeId doesn't Exists
							let salary = {
								gross_salary : grossSalary.gross_salary,
								net_salary : finalNetSalary,
								employeeId : grossSalary.employeeId
							};
							database.salaries.insert(salary, function(err, inserted){
								if (inserted) {
									event.returnValue = 1;
								} else {
									event.returnValue = 0;
								}
							})
						}
						if (doc) {
							database.salaries.update({employeeId : grossSalary.employeeId},{$set : {
								gross_salary: grossSalary.gross_salary,
								net_salary : finalNetSalary
							}},{}, function(err, num){
								if (num) {
									event.returnValue = 2;
									database.salaries.persistence.setAutocompactionInterval(100);
								}else if (err) {
									event.returnValue = 0;
								}
							})
						}
					})
				}
			})
		}
	});
})

// Get all gross pay
ipcMain.on('get-all-salary-gross', (event, id)=>{
	database.salaries.findOne({employeeId : id}, function (err, data){
		if (data == null) {
			event.returnValue = 0;
		}else {
			event.returnValue = data;
		}
	})
});

// Event for getting all earnings
ipcMain.on('get-earnings', (event, employ)=>{
	database.earnings.findOne({employeeId: employ}, function(err, earnin){
		//console.log(earnin);
		if (earnin == null) {
			event.returnValue = 0;
		} else {
			let earn = calculateFinalEarnings(
				earnin.overtime, earnin.bonus, earnin.dress_allowances, earnin.car_allowances,
				earnin.rent_allowances, earnin.travel_allowances);
				event.returnValue = earn;
		}
	})
})

ipcMain.on('get-deduct', (event, employ)=>{
	database.salaries.findOne({employeeId : employ}, function(err, salary){
		if (salary == null) {
			event.returnValue = 0;
		} else {
			database.deductions.find({employeeId : employ}, function(err, deduc){

				let income = calculateIncomeTax(deduc[0].income_tax, salary.gross_salary);
				let ssnit = calculateSsnitTax(deduc[0].ssnit_tax, salary.gross_salary);
				let finalDeduc = calculateDeduction(income, ssnit, deduc[0].loans, deduc[0].other_deduction);
				event.returnValue = finalDeduc;
			})
		}
	})
})


// Event to fetch all count for tables
ipcMain.on('get-me-all-data', (event, res)=>{
	database.customers.find({}, function(err, len){
		if (len) {
			event.sender.send('get-me-all-data-reply', len);
		}else if (err) {
			event.sender.send('get-me-all-data-reply', 'Error occur at code 500');
		}

	})
});

// Event to get subsequent salaries
ipcMain.on('get-me-subsequent-salary', (event, data)=>{
	database.salaries.findOne({employeeId: data}, function(err, salary){
		if (salary == null) {
			event.returnValue = 0;
		}else if (err){
			event.returnValue = 0;
		} else {
			event.returnValue = salary;
		}
	})
})

// Method to calculate Tax
calculateSsnitTax = (tax, gross)=>{
	if (tax != 0) {
		let result = tax / 100;
		let final = result * gross;
		return final;
	} else {
		return 0;
	}
}
// Calculate income Tax
calculateIncomeTax = (tax, gross)=>{
	if (tax != 0) {
		let result = tax / 100;
		let final = result * gross;
		return final;
	} else {
		return 0;
	}
}
// Get Actual deduction
calculateDeduction = (incomeTax, ssnitTax, loans, other)=>{
	let deduc = incomeTax + ssnitTax + loans + other;
	return deduc;
}
// Calculate overall net pay
calculateNetSalary = (incomeTax, ssnitTax, loans, other, overallEarnings, grossPay)=>{
	let deduct = incomeTax + ssnitTax + loans + other;
	let result = overallEarnings + grossPay;
	let final = result - deduct;
	return final;
}

// Calculate earnings
calculateFinalEarnings = (overtime, bonus, dress, car, rent, travel)=>{
	let result = overtime + bonus + dress + car + rent + travel
	return result;
}

