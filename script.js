// Real work 
const hamburger = document.getElementById("hamburgerMenu");
const navLinks = document.querySelector(".navLinks");


// checks the html tag for navLinks and add or removes active from the class 
function toggleHamburger() {
    navLinks.classList.toggle("active");
}

hamburger.addEventListener('click', toggleHamburger); 




// // practice

// console.log("Im in your walls")


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




// console.log("My dog's full name is " + dog.fullName() + " and she is a " + dog["breed"])

// console.log("My owner's name is " + dog.Owner["name"] + " and his favorite food is " + dog.Owner["favoriteFood"])

// let space = "";

// for (let x in dog) {
//     space += dog[x] + ",";
// }; 


// console.log(space);

// const dogArray = JSON.stringify(dog)

// console.log(dogArray)

// function Guitar(brand, model, year, pups) {
//     this.brand = brand;
//     this.model= model;
//     this.year = year;
//     this.pups = pups;
// }
// Guitar.prototype.nationality = "Japanese";

// const guitar1 = new Guitar("teisco", "spectrumV", 1997, "split coil");
// const guitar2 = new Guitar("teisco", "spectrumV", 2015, "split coil");


// console.log(guitar1.nationality)


// // my button

// let button = document.getElementById("btn");

// button.addEventListener('click', displayDate)

// function displayDate() {
//     document.getElementById('demo').innerHTML = 'There is a lot to know about this topic';
// }


