document.addEventListener("DOMContentLoaded", function () {
    let previousWidth = window.innerWidth;

    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    function handleResize() {
        const currentWidth = window.innerWidth;
        if (currentWidth !== previousWidth) {
            previousWidth = currentWidth;
            setScreenSize();
        }
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    window.addEventListener('resize', debounce(setScreenSize, 100));
    setScreenSize();

    function createSlideshow({elementId, folderPath, imageCount, imageFormat = '.png', interval = 100}) {
        const slideshowElement = document.getElementById(elementId);
        if (!slideshowElement) return console.warn(`Element with id "${elementId}" not found.`);

        const imageCache = [];
        for (let i = 1; i <= imageCount; i++) {
            const img = new Image();
            img.src = `${folderPath}${i}${imageFormat}`;
            imageCache.push(img);
        }

        let currentImageIndex = 0;
        let lastTime = performance.now();

        function animate(now) {
            if (now - lastTime >= interval) {
                currentImageIndex = currentImageIndex < imageCount ? currentImageIndex + 1 : 1;
                slideshowElement.src = imageCache[currentImageIndex - 1].src;
                lastTime = now;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    createSlideshow({
        elementId: 'eye',
        folderPath: './assets/file/eye/',
        imageCount: 23,
        imageFormat: '.png',
        interval: 100
    });

    createSlideshow({
        elementId: 'dashboard',
        folderPath: './assets/file/dashboard/',
        imageCount: 23,
        imageFormat: '.png',
        interval: 100
    });

    createSlideshow({
        elementId: 'light',
        folderPath: './assets/file/light/',
        imageCount: 23,
        imageFormat: '.png',
        interval: 100
    });

    function createSlideshowController({elementId, folderPath, imageCount, imageFormat = '.png', interval = 100}) {
        const slideshowElement = document.getElementById(elementId);
        if (!slideshowElement) {
            console.warn(`Element with id "${elementId}" not found.`);
            return null;
        }

        const imageCache = [];
        for (let i = 1; i <= imageCount; i++) {
            const img = new Image();
            img.src = `${folderPath}${i}${imageFormat}`;
            imageCache.push(img);
        }

        let currentImageIndex = 0;
        let intervalId = null;
        let pendingStop = false;

        function start() {

            pendingStop = false;
            if (intervalId !== null) return;
            intervalId = setInterval(() => {
                if (pendingStop && currentImageIndex === imageCount) {
                    slideshowElement.src = `${folderPath}0${imageFormat}`;
                    clearInterval(intervalId);
                    intervalId = null;
                    currentImageIndex = 0;
                    return;
                }

                currentImageIndex = currentImageIndex < imageCount ? currentImageIndex + 1 : 1;
                slideshowElement.src = imageCache[currentImageIndex - 1].src;
            }, interval);
        }

        function stopWithFinish() {
            pendingStop = true;
        }

        return {start, stopWithFinish};
    }

    const slideshowControllers = {
        cat: createSlideshowController({
            elementId: 'cat',
            folderPath: './assets/file/cat/',
            imageCount: 23,
            imageFormat: '.png',
            interval: 100
        }),
        cell: createSlideshowController({
            elementId: 'cell',
            folderPath: './assets/file/cell/',
            imageCount: 23,
            imageFormat: '.png',
            interval: 100
        }),
        chain: createSlideshowController({
            elementId: 'chain',
            folderPath: './assets/file/chain/',
            imageCount: 23,
            imageFormat: '.png',
            interval: 100
        }),
        poster: createSlideshowController({
            elementId: 'poster',
            folderPath: './assets/file/poster/',
            imageCount: 16,
            imageFormat: '.png',
            interval: 100
        })
    };

    document.querySelectorAll('.item').forEach(item => {
        ['cat', 'cell', 'chain', 'poster'].forEach(type => {
            if (item.classList.contains(type)) {
                const backElement = document.querySelector(`.back--${type}`);
                const controller = slideshowControllers[type];
                if (!backElement || !controller) return;

                item.addEventListener('mouseenter', () => {
                    backElement.classList.add('act');
                    controller.start();
                });

                item.addEventListener('mouseleave', () => {
                    controller.stopWithFinish();
                    backElement.classList.remove('act');
                });
            }
        });
    });
});

function stopAllMedia(excludeVideo = false) {
    const audio = document.getElementById('backgroundAudio');
    const video = document.querySelector('.mv');
    const marquee = document.querySelector('.sp-title-inner');

    if (!audio.paused) {
        audio.pause();
        marquee.style.animationPlayState = 'paused';
    }

    if (!excludeVideo && !video.paused) {
        video.pause();
    }
}

document.querySelector('.mv').addEventListener('play', function () {
    stopAllMedia(true);
});


document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
        const types = ['cat', 'cell', 'chain', 'poster'];
        const clickedType = types.find(type => item.classList.contains(type)) || "unknown";
        if (clickedType == 'chain') {
            alert(`COMING SOON`);
        } else {
            // alert(`클릭한 아이템: ${clickedType}`);
        }
    });
});

$('.guide-dim').on('click', function () {
    if (window.innerWidth > 1024) {
        $('.guide').hide();
    } else {
        $('.guide').addClass('g-step--m');
    }
});

$('.guide-inner--m').on('click', function () {
    $('.guide').hide();
});

$('.nav-btn--close').on('click', function () {
    $('.container').removeClass('cover');
    $('.container').removeClass('cover--ex');
    $('.layer-popup').removeClass('show');
    $('.nav-btn--gnb').removeClass('on');
    $('.nav').removeClass('on');

    $('.nav-btn--gnb').text('EXPLORE');

    let mw = $('.mv')[0];

    if (mw) {
        mw.pause();
        mw.currentTime = 0;
    }

    $('.layer-popup-dim').hide();

    $('.sch-icon').removeClass('on');
    $('.sch-popup').removeClass('show');
    $('.sch-popup').removeClass('sch-cont--1');
    $('.sch-popup').removeClass('sch-cont--2');
});

$('.nav-btn--gnb').on('click', function () {
    $(this).toggleClass('on');
    if ($(this).hasClass('on')) {
        $(this).text('CLOSE');
        $('.nav').addClass('on');
    } else {
        $(this).text('EXPLORE');
        $('.nav').removeClass('on');
    }

});

$('.nav-btn--info').on('click', function () {
    $('.container').addClass('cover--ex');
    $('.ex-sec').addClass('show');
    $('.nav-btn--gnb').removeClass('on');
    $('.nav').removeClass('on');
    $('.nav-btn--gnb').text('EXPLORE');
});

$('.poster, .nav-item--photo').on('click', function () {
    $('.container').addClass('cover');
    $('.photo-sec').addClass('show');
    $('.nav').removeClass('on');
});

$('.cat, .nav-item--sch').on('click', function () {
    $('.container').addClass('cover');
    $('.sch-sec').addClass('show');
    $('.nav').removeClass('on');
});

$('.cell, .nav-item--video').on('click', function () {
    $('.container').addClass('cover');
    $('.mv-sec').addClass('show');
    $('.nav').removeClass('on');
});

$('.schedule-close-btn').on('click', function () {
    $('.container').removeClass('cover');
    $('.sch-sec').removeClass('show');
    $('.container').removeClass('cover--ex');
    $('.nav-btn--gnb').removeClass('on');
    $('.nav').removeClass('on');
    $('.nav-btn--gnb').text('EXPLORE');
});

$('.sch--1').on('click', function () {
    $('.layer-popup-dim').show();
    $('.sch-icon').removeClass('on');
    $('.sch--1').addClass('on');
    $('.sch-popup').addClass('show');
    $('.sch-popup').removeClass('sch-cont--2');
    $('.sch-popup').addClass('sch-cont--1');
});

$('.sch--2').on('click', function () {
    $('.layer-popup-dim').show();
    $('.sch-icon').removeClass('on');
    $('.sch--2').addClass('on');
    $('.sch-popup').addClass('show');
    $('.sch-popup').removeClass('sch-cont--1');
    $('.sch-popup').addClass('sch-cont--2');
});

$('.sch-sec .layer-popup-dim').on('click', function () {
    $(this).hide();
    $('.sch-icon').removeClass('on');
    $('.sch-popup').removeClass('show');
    $('.sch-popup').removeClass('sch-cont--1');
    $('.sch-popup').removeClass('sch-cont--2');
});

$('.ex-bg').hover(function () {
    $(this).find('img').attr('src', 'assets/file/img/credit/crew-b.png');
    $('.container').addClass('act-ex');
    $('.credit-wrap').addClass('on');
}, function () {
    $(this).find('img').attr('src', 'assets/file/img/credit/crew-f.png');
    $('.container').removeClass('act-ex');
    $('.credit-wrap').removeClass('on');
});

$('.credit-wrap').on('click', function () {
    $(this).toggleClass('on');
    if ($(this).hasClass('on')) {
        $('.ex-bg').find('img').attr('src', 'assets/file/img/credit/crew-b.png');
        $('.container').addClass('act-ex');
    } else {
        $('.ex-bg').find('img').attr('src', 'assets/file/img/credit/crew-f.png');
        $('.container').removeClass('act-ex');
    }
});

$('.sound-panel-btn').on('click', function () {
    $('.sound-panel').show();
});

$('.sound-panel-close-btn').on('click', function () {
    $('.sound-panel').hide();
});

let swiper;

function initSwiper() {
    if (window.innerWidth > 1024) {
        if (!swiper) {
            swiper = new Swiper('.photo-cont', {
                spaceBetween: 0,
                freeMode: true,
                slidesPerView: 'auto',
                navigation: {
                    nextEl: '.ps-btn--next',
                    prevEl: '.ps-btn--prev',
                },
            });
        }
    } else {
        if (swiper) {
            swiper.destroy();
            swiper = null;
        }
    }
}

window.addEventListener('load', initSwiper);
window.addEventListener('resize', initSwiper);

document.querySelector('.guide-desc-wrapper').addEventListener('click', function () {
    const audio = document.getElementById('backgroundAudio');
    const marquee = document.querySelector('.sp-title-inner');
    const gDesc = document.querySelector('.guide-desc-wrapper p:first-child');

    if (audio.paused) {
        audio.play();
        marquee.style.animationPlayState = 'running';
        gDesc.textContent = '소리 끄고 입장하기';
        this.classList.remove('on');
    } else {
        audio.pause();
        marquee.style.animationPlayState = 'paused';
        gDesc.textContent = '소리 켜고 입장하기';
        this.classList.add('on');
    }
});

document.querySelector('.sp-play-btn').addEventListener('click', function () {
    const audio = document.getElementById('backgroundAudio');
    const marquee = document.querySelector('.sp-title-inner');

    if (audio.paused) {
        audio.play();
        marquee.style.animationPlayState = 'running';
    } else {
        audio.pause();
        marquee.style.animationPlayState = 'paused';
    }
});

$('.sp-btn').on('click', function () {
    const audio = document.getElementById('backgroundAudio');

    $('.sp-btn').toggleClass('chk');
    if ($(this).hasClass('chk')) {
        $('#backgroundAudio').attr('src', './assets/file/B.mp3');
        $('.sp-title-inner p').text('CHÉRIEXX SOUNDTRACK B');
        audio.play();
    } else {
        $('#backgroundAudio').attr('src', './assets/file/A.mp3');
        $('.sp-title-inner p').text('CHÉRIEXX SOUNDTRACK A');
        audio.play();
    }
});

$('.nav-item--shop').on('click', function () {
    alert(`COMING SOON`);
});