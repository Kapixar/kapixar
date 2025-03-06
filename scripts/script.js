// smooth scroll
const scrollContainer = document.querySelector('.paralaxContainer');

const lenis = new Lenis({
    autoRaf: true,
    wrapper: scrollContainer,
});





const projectTabs = document.querySelectorAll('.project');

// if project div is in full sight on mobile, add class hightlight
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
            entry.target.classList.add('highlight');
        } else {
            entry.target.classList.remove('highlight');
        }
    });
}, { threshold: [0, 1] });

projectTabs.forEach((project) => {
    observer.observe(project);
});






// placing blobs
const blobAmount = 10;
const viewPortHeight = 500;
const paralaxContainer = document.querySelector('.paralaxContainer');

for (let i = 0; i < blobAmount; i++) {
    const blobSvg = getBlobSvg({ growth: 2, edges: 6 });
    blobSvg.classList.add('floatingBlob', `layer${Math.round(Math.random() * 9)}`);
    // set random --blob-delay
    blobSvg.style.setProperty('--blob-delay', `${Math.random() * 3}s`);
    // set random --blob-speed
    blobSvg.style.setProperty('--blob-speed', `${Math.random() * 10 + 10}s`);
    // set random --blob-scale
    blobSvg.style.setProperty('--blob-scale', Math.random() + 0.8);
    blobSvg.style.setProperty('--blob-rotate', `${Math.random() * 360}deg`);

    const verticalPosition = (i / blobAmount) * viewPortHeight;
    const horizontalPosition = (i % 2 === 0) ? Math.random() * 50 : 50 + Math.random() * 50;
    blobSvg.style.setProperty('--blob-inset', `${verticalPosition}vh ${horizontalPosition}vw`);

    paralaxContainer.prepend(blobSvg);
}

const homeBlob = getLiquidBlobSvg({ growth: 2, edges: 10, color: "#FF4C29" });
homeBlob.classList.add('homeBlob');
document.querySelector('#home').prepend(homeBlob);




// seting up technology carousel
const techs = document.querySelectorAll('.tech li');
setUpRotator(techs);

const softs = document.querySelectorAll('.soft li');
setUpRotator(softs);

const goals = document.querySelectorAll('.goal li');
setUpRotator(goals);

function setUpRotator(elements) {
    const amountOfElements = elements.length;
    const angle = 360 / amountOfElements;
    let currentAngle = 0;
    elements.forEach((element, i) => {
        element.style.transform = `rotateY(${currentAngle}deg)`;
        currentAngle += angle;
    });
}