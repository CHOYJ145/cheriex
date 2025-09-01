(function () {
    function adjustBodyClass() {
        const imageRatio = 1920 / 1365;
        const browserRatio = window.innerWidth / window.innerHeight;

        if (browserRatio < imageRatio) {
            document.body.classList.remove('wide');
            document.body.classList.add('tall');
        } else {
            document.body.classList.remove('tall');
            document.body.classList.add('wide');
        }
    }

    window.addEventListener('resize', adjustBodyClass);

    adjustBodyClass();

    const introEl = document.querySelector('.intro');
    const introHeroImg = document.querySelector('.intro-hero img');
    const loadingNumEl = document.querySelector('.loading-num');

    const introImageCount = 41;
    let currentIntroIndex = 0;
    let slideshowInterval = null;

    let slideshowFinished = false;
    let heavyLoaded = false;

    const heavyImg = new Image();
    heavyImg.src = './assets/file/back.png';
    heavyImg.onload = () => {
        heavyLoaded = true;
        maybeFinishIntro();
    };

    function startSlideshow() {
        slideshowInterval = setInterval(() => {
            if (currentIntroIndex < introImageCount) {
                currentIntroIndex++;
                introHeroImg.src = `./assets/file/intro/${currentIntroIndex}.png`;
            } else {
                clearInterval(slideshowInterval);
                slideshowFinished = true;
                maybeFinishIntro();
            }
        }, 100);
    }

    function maybeFinishIntro() {
        if (slideshowFinished && heavyLoaded) {
            animateLoadingTo100();
        }
    }

    function animateLoadingTo100() {
        let currentValue = parseInt(loadingNumEl.textContent, 10) || 0;
        const timer = setInterval(() => {
            if (currentValue < 100) {
                currentValue++;
                loadingNumEl.textContent = currentValue < 10 ? '0' + currentValue : currentValue;
            } else {
                clearInterval(timer);
                introEl.classList.add('fade-out');
                setTimeout(() => {
                    introEl.remove();
                }, 500);
            }
        }, 25);
    }

    startSlideshow();
})();

if (window.innerWidth > 1024) {
    document.addEventListener('DOMContentLoaded', () => {
        const bgBackEl = document.querySelector(".bg-back");
        if (bgBackEl) {
            bgBackEl.style.transform = "translate(0,0)";
        }
    });

    let isMoving = false;
    let latestEvent;

    document.addEventListener("mousemove", (e) => {
        latestEvent = e;
        if (!isMoving) {
            window.requestAnimationFrame(() => {
                const { clientX, clientY } = latestEvent;
                const {innerWidth, innerHeight} = window;
                const contentEl = document.querySelector(".content");
                const bgEl = document.querySelector(".cover--light");
                const bgBackEl = document.querySelector(".bg-back");

                const xRatio = (e.clientX / innerWidth) - 0.5;
                const xRatioEx = (e.clientX / innerWidth) - 0.5;
                const maxXMove = 20;
                const maxXMoveEx = 10;
                const moveX = -xRatio * maxXMove * 2;
                const moveXEx = -xRatioEx * maxXMoveEx * 2;
                bgEl.style.transform = `translate(${moveX}px, 0)`;
                bgBackEl.style.transform = `translate(${moveXEx}px, 0)`;

                if (document.body.classList.contains("wide")) {
                    if (e.clientY < innerHeight * 0.2 || e.clientY > innerHeight * 0.9) {
                        const yRatio = (e.clientY / innerHeight) - 0.5;
                        const maxYMove = 100;
                        const moveY = -yRatio * maxYMove * 2;
                        contentEl.style.transform = `translate(0, ${moveY}px)`;
                    } else {
                        contentEl.style.transform = "translate(0, 0)";
                    }
                } else if (document.body.classList.contains("tall")) {
                    if (e.clientX < innerWidth * 0.25 || e.clientX > innerWidth * 0.75) {
                        const xRatioContent = (e.clientX / innerWidth) - 0.5;
                        const maxXMoveContent = 100;
                        const moveXContent = -xRatioContent * maxXMoveContent * 2;
                        contentEl.style.transform = `translate(${moveXContent}px, 0)`;
                    } else {
                        contentEl.style.transform = "translate(0, 0)";
                    }
                } else {
                    contentEl.style.transform = "translate(0, 0)";
                }

                isMoving = false;
            });
            isMoving = true;
        }
    });
}

if (window.innerWidth <= 1024 && window.DeviceOrientationEvent) {
    const requestAccess = () => {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                console.log("DeviceOrientation permission:", response);
                if (response === 'granted') {
                    startGyro();
                }
            })
            .catch(console.error);
        document.body.removeEventListener('click', requestAccess);
    };

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.body.addEventListener('click', requestAccess);
    } else {
        startGyro();
    }
}

function startGyro() {
    window.addEventListener("deviceorientation", (event) => {
        const gamma = event.gamma || 0;
        const beta = event.beta || 0;

        const maxOffset = 5;
        const maxOffsetL = 8;
        const moveX = (gamma / 45) * maxOffset;
        const moveY = (beta / 45) * maxOffset;
        const moveXL = (gamma / 45) * maxOffsetL;
        const moveYL = (beta / 45) * maxOffsetL;

        const bgBackEl = document.querySelector('.bg-back');
        const coverLightEl = document.querySelector('.cover--light');
        if (bgBackEl) {
            bgBackEl.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        if (coverLightEl) {
            coverLightEl.style.transform = `translate(${moveXL}px, ${moveYL}px)`;
        }
    });
}
