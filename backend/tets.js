let currentDate = new Date(Date.now());
console.log(currentDate);

// extrect the month, day, year, hours, minutes, seconds
let month = currentDate.getMonth();
let day = currentDate.getDate();
let year = currentDate.getFullYear();
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();
let seconds = currentDate.getSeconds();
console.log(`Month: ${month}, Day: ${day}, Year: ${year}, Hours: ${hours}, Minutes: ${minutes}, Seconds: ${seconds}`);