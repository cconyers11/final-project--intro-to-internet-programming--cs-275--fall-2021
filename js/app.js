window.onload = () => {
    const ALLARROWS = document.getElementsByClassName(`arrow`);
    const ALLSLIDES = document.getElementsByClassName(`slide`);

    let offset = 0;

    let bothArrows = () => {
        ALLARROWS[0].classList.remove(`hidden`);
        ALLARROWS[1].classList.remove(`hidden`);
        if(offset === 0) {ALLARROWS[1].classList.add(`hidden`);
        } else if(offset === -2000) {ALLARROWS[0].classList.add(`hidden`);}
    };

    let moveLeft = () => {
        if(offset > -1800)
        {
            offset -= 500;
            for(let slide of ALLSLIDES) {slide.style.left = offset + `px`;}
        }
        bothArrows();
    };

    let moveRight = () => {
        if(offset < 0)
        {
            offset += 500;
            for(let slide of ALLSLIDES) {slide.style.left = offset + `px`;}
        }
        bothArrows();
    };

    ALLARROWS[0].addEventListener(`click`, moveLeft);
    ALLARROWS[1].addEventListener(`click`, moveRight);

    document.addEventListener(`keydown`, (i) => {
        if (i.key === `ArrowLeft`) {moveLeft();
        } else if (i.key === `ArrowRight`) {moveRight();}
    });
};
