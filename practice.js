// // practice


// const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
// const days = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]

// wholeYear = months.concat(days)

// console.log(wholeYear.reverse())


// console.log(Array.isArray(months)) 

// console.log(wholeYear.join(" -- "))

// console.log(months[months.length - 1 ])

// let text = "<ul>";

// for (let i = 0; i < mlen; i++) {
//     text += '<li>' + months[i] + '</li>'; 

//     console.log(text)
// }



// const dog = {
//     firstName: "earth",
//     lastName: "walker",
//     breed: "mutt",
//     color: "brown",
//     fullName: function () {
//         return this.firstName + " " + this.lastName;
//     },

//     Owner: {
//         name: "Kal",
//         favoriteFood: "ramem",
//     }

// };

// const d = Math.floor(Math.random() * 100);
// const year = new Date()
// const thisYear = year.getFullYear();

// if (thisYear == 2021) {

//     document.getElementById('demo').innerHTML = d;

// } else if (thisYear != 2016) {
    
    
//     document.getElementById('demo').innerText = "you wish it was this year huh you bum?";

// } else {
    
//     document.getElementById('demo').innerText = "wrong year";
// }



// console.log(d)


// date = new Date()
// day = date.getDay()

// console.log(day)

// switch (day) {
//     case 0:
//         day = "Sunday"
//         break;
    
//     case 1:
//         day = "Monday"
//         break;
    
//     case 2:
//         day = "Tuesday"
//         break;
        
// }

// document.getElementById('demo').innerHTML = "it's only " + day;

// const myGuitar = {
//     brand: "Tiesco",
//     model: "Spectrum V",
//     color: "Blue",
//     strings: 6,
//     year: 1997,
//     owner: "Kal"
// };

// let text = "";

// for (let characteristic in myGuitar) {
//     text += myGuitar[characteristic] + " --- "
// };

// document.getElementById('demo').innerHTML = text; 

// // practive line 2

// const openDays = "Tokyo Drift";

// text = '';

// for (let days of openDays) {
//     text += days + " ";
// }

// document.getElementById('demo2').innerHTML = text;

const items = new Set(["super potion", "lemonade", "fresh water"]);
items.add("Master Ball")
items.add("TM 192")
items.add("Poke Flute")
items.add("Master Ball")
items.add("TM 192")
items.add("Poke Flute")

const keyItem = "Arceus Flute"

items.add(keyItem)

let text = '';

for (const item of items) {
    text += item + "<br>";
}

console.log(items.has('Master Balls'))
document.getElementById('demo').innerHTML = text;