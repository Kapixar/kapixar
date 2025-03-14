

window.addEventListener('load', () => {
    // placing blobs
    const blobAmount = 10;
    const paralaxContainer = document.querySelector('.paralaxContainer');
    const maxHeight = paralaxContainer.offsetHeight;

    function generateBlob(i, time) {
        const blobSvg = getBlobSvg({ growth: 2, edges: 6 });
        blobSvg.classList.add('floatingBlob', `layer${Math.round(Math.random() * 9)}`);
        // set random --blob-delay
        const delay = Math.random() * 2 + 1;
        blobSvg.style.setProperty('--blob-delay', `${delay}s`);
        // set random --blob-speed
        blobSvg.style.setProperty('--blob-speed', `${time}s`);
        // set random --blob-scale
        blobSvg.style.setProperty('--blob-scale', Math.random() + 0.8);
        blobSvg.style.setProperty('--blob-rotate', `${Math.random() * 360}deg`);

        const verticalPosition = Math.min(maxHeight, (Math.random() + paralaxContainer.scrollTop / window.outerHeight) * 400 - 100);
        console.log(`verticalPosition: ${verticalPosition}`);

        const horizontalPosition = (i / blobAmount) * 200 - 50;
        blobSvg.style.setProperty('--blob-inset', `${verticalPosition}vh ${horizontalPosition}vw`);

        paralaxContainer.prepend(blobSvg);

        setTimeout(() => {
            blobSvg.remove();
            generateBlob(i, time);
        }, (time + delay) * 1000); // convert to milliseconds
    }


    for (let i = 0; i < blobAmount; i++) {
        const time = Math.random() * 10 + 5;

        setTimeout(() => {
            generateBlob(i, time);
        }, time * 100);
    }

    // const homeBlob = getLiquidBlobSvg({ growth: 2, edges: 10, color: "#FF4C29" });
    // homeBlob.classList.add('homeBlob');
    // document.querySelector('#home').prepend(homeBlob);




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

    // scaling the carousel

    const maxScale = 16;

    const carousels = document.querySelectorAll('.rotationContainer');
    carousels.forEach((carousel) => {
        scaleCarousel(carousel);
        window.addEventListener('resize', () => {
            scaleCarousel(carousel);
        });
    });

    function scaleCarousel(carousel) {
        const screenWidth = window.innerWidth;
        const carouselRealWidth = getComputedStyle(carousel, "after");

        console.log(getComputedStyle);

        console.log(screenWidth, carouselRealWidth.length);



        const scaleValue = screenWidth / parseInt(carouselRealWidth.length) * 2.5;

        carousel.style.setProperty('--scale-factor', scaleValue > maxScale ? maxScale : scaleValue);
    }
});