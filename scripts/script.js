

window.addEventListener('load', () => {


    // blob configuration
    // top - vertical position in px (this is scaled by perspective later)
    // left - horizontal position 0 - left side of the screen, 1 - right side of the screen
    // scale - size of the blob (this is scaled by perspective later) - rotation speed is also scaled by this value
    // layer - z-index of the blob
    const blobsSetup = [
        { top: 0, left: 0.1, scale: 3, layer: 2 },        // landing
        { top: 50, left: 0.9, scale: 3, layer: 4 },
        { top: 700, left: 0.1, scale: 1, layer: 3 },

        { top: 800, left: 0.9, scale: 3, layer: 6 },      // about me
        { top: 1400, left: 0.1, scale: 2, layer: 8 },
        { top: 1800, left: 0.7, scale: 2, layer: 7 },
        { top: 2300, left: 0.2, scale: 2, layer: 6 },
        { top: 2600, left: 0.9, scale: 3, layer: 4 },
        { top: 2800, left: -0.3, scale: 1.5, layer: 5 },
        { top: 3200, left: 0.1, scale: 1, layer: 2 },

        { top: 3900, left: 0.8, scale: 1, layer: 3 },
        { top: 4000, left: 0.7, scale: 1.2, layer: 5 },
        { top: 4000, left: 0.1, scale: 2.5, layer: 4 },   // technology
        { top: 4600, left: 0.8, scale: 1, layer: 7 },
        { top: 4900, left: -0.4, scale: 1.5, layer: 6 },
        { top: 5100, left: 0.4, scale: 1, layer: 9 },
        { top: 5100, left: 0, scale: 0.7, layer: 8 },
        { top: 5400, left: 0.7, scale: 1.2, layer: 8 },

        { top: 5700, left: -0.3, scale: 1.2, layer: 8 },
        { top: 5900, left: 0.9, scale: 1.7, layer: 7 },
        { top: 6200, left: 0.2, scale: 2, layer: 6 },
        { top: 6400, left: 0.5, scale: 1, layer: 5 },

        { top: 6800, left: -0.3, scale: 1, layer: 8 },
        { top: 7000, left: 0.9, scale: 2, layer: 7 },
        { top: 7100, left: 0.2, scale: 1.4, layer: 8 },
        { top: 7300, left: 0.5, scale: 0.7, layer: 5 },

        { top: 7700, left: 0.3, scale: 1.5, layer: 4 },  // projects
        { top: 7900, left: 0.9, scale: 1.5, layer: 3 },
        { top: 8100, left: -0.1, scale: 1.2, layer: 1 },
        { top: 8400, left: 1, scale: 1, layer: 0 },
        { top: 8450, left: 0.3, scale: 1.2, layer: 1 },
        { top: 8600, left: 0.5, scale: 1, layer: 0 },
    ]

    const highestBlob = blobsSetup.reduce((acc, blob) => {
        return blob.top > acc ? blob.top : acc;
    } , 0);

    const paralaxContainer = document.querySelector('.paralaxContainer');
    const blobContainer = document.querySelector('.blobContainer');

    // positions are handled by css variables
    for (const blob of blobsSetup) {
        const blobSvg = getBlobSvg({ growth: 2, edges: 6 });
        blobSvg.classList.add('floatingBlob', `layer${blob.layer}`);
        blobSvg.style.setProperty('--blob-top', `${blob.top}px`);
        blobSvg.style.setProperty('--blob-left', `50vw`);
        blobSvg.style.setProperty('--blob-leftPos', `${blob.left * 100}vw`);
        blobSvg.style.setProperty('--blob-scale', blob.scale);
        blobSvg.style.setProperty('--blob-speed', `${blob.scale * 20}s`);
        blobSvg.style.setProperty('--blob-direction', `${Math.random() > 0.5 ? 'reverse' : 'normal'}`);
        blobContainer.prepend(blobSvg);
    }

    // function scaling vertical position of the blobs to the height of the website
    function scaleBlobContainer() {
        const blobsHeight = highestBlob;
        
        const siteHeight = paralaxContainer.scrollHeight + 400;
        const scaleToApply = siteHeight / blobsHeight;
        console.log(`scaleToApply: ${siteHeight} / ${blobsHeight} = ${scaleToApply}`);
        blobContainer.style.setProperty('scale', scaleToApply);

        // fixing the left position of the blobs
        // this is done by averaging the left position with the scale factor to 50vw
        for (const blob of blobContainer.children) {

            const blobLeftPosition = parseFloat(getComputedStyle(blob).getPropertyValue('--blob-leftPos'));

            // average the blob left position with the scale factor to 50vw
            const actualLeftPosition = (blobLeftPosition + 50) / 2;
            blob.style.setProperty('--blob-left', `${actualLeftPosition}vw`);
        }
    }

    scaleBlobContainer();

    window.addEventListener('resize', () => {
        scaleBlobContainer();
    });


    // placing the icons in the carousel
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


    // scaling the carousel to cover the window width
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

        const scaleValue = screenWidth / parseInt(carouselRealWidth.length) * 4;

        carousel.style.setProperty('--scale-factor', scaleValue > maxScale ? maxScale : scaleValue);
    }
});