// Real work 
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburgerMenu");
    const navLinks = document.querySelector(".navLinks");
    const bars = document.querySelectorAll('.bar')

    console.log(bars)


    // checks the html tag for navLinks and add or removes active from the class 
    function toggleHamburger() {
        navLinks.classList.toggle("active");
        bars.forEach(bar => bar.classList.toggle('x'))
    }


    function onScroll() {
        navLinks.classList.remove("active")
        bars.forEach(bar => bar.classList.remove('x'));
    }

    
    hamburger.addEventListener('click', toggleHamburger)
    window.addEventListener('scroll', onScroll);
});