console.log("hello world")

const modalBtns = [...document.getElementsByClassName('modal-button')]
console.log(modalBtns)
const modalBody = document.getElementById('modal-body-confirm')

const startBtn = document.getElementById('start-button')

const url = window.location.href

$(document).ready(function () {
    $('a[href^="#"]').on('click', function (event) {
        event.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, 800); // Adjust the scroll speed as needed
        }
    });
});

// Loading Animation
$(window).on('load', function () {
    $('.loading-spinner').fadeOut('slow', function () {
        $(this).remove();
    });
});



modalBtns.forEach(modalBtn => modalBtn.addEventListener('click', () => {
    const pk = modalBtn.getAttribute('data-pk')
    const name = modalBtn.getAttribute('data-quiz')
    const numQuestion = modalBtn.getAttribute('data-questions')
    const difficulty = modalBtn.getAttribute('data-difficulty')
    const scoreToPass = modalBtn.getAttribute('data-pass')
    const time = modalBtn.getAttribute('data-time')

    modalBody.innerHTML = `
        <div class="h5 mb-3">Are You Sure you want to begin" <b>${name}</b>"?</div>
        <div class="text-muted">
            <ul>
                <li>difficulty: <b>${difficulty}</b> </li>
                <li>number of questions: <b>${numQuestion}</b> </li>
                <li>score to pass: <b>${scoreToPass}%</b> </li>
                <li>time: <b>${time} min</b> </li>
            </ul>
        </div>
    `
    startBtn.addEventListener('click', () => {
        window.location.href = url + pk
    })
}))