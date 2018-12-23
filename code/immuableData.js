const staff1 = {
    company: "Kingsoft", 
    name: 'Marlon',
    birthdate: '1986-09-01',
};

const changeStaff = (staff, newName, newBday) => {
    return Object.assign({}, staff, {name: newName, birthdate: newBday});
};

const staff2 = changeStaff(staff1, 'Kevin', '1996-11-10');
console.log(staff1, staff2);

