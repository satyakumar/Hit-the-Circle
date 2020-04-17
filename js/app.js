let circleColors = ['#FF0000','#2F4F4F','#9400D3','#A0522D','#FFD700','#006400','#66CDAA','#00BFFF','#000000','#2F4F4F',
                '#FFFF00','#9400D3','#FF0000','#FF1493','#00BFFF','#00FA9A','#808000','#000000','#00FFFF','#006400','#BC8F8F','#00FFFF','#A0522D','#FFFF00','#FF1493','#808000','#000080','#FFD700','#00FA9A','#FF8C00','#FFDAB9','#000080','#66CDAA','#FFDAB9','#BC8F8F','#FF8C00'],

    $deck = $('.deck'),

    autoSelectedCell,
    totalCells = circleColors.length,
    score,
    timer;


// Shuffling function: enables that no two games have the same color arrangement 
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// The function init() enables the game to begin
let init = function () {
    score = 0;
    autoSelectedCell = undefined;
    // The shuffle function shuffles the cells array
    let shuffledCells = shuffle(circleColors);
    $deck.empty();

    for (let i = 0; i < totalCells; i++) {
        $deck.append($('<li class="card"><span class="circle" id="cell-'+(i+1)+'" data-circle-color = ' + shuffledCells[i] + '></span></li>'))
    }
    $('#score span').html(score);
};

// Modal alert window showing game over message with score
function gameOver() {
    $('#winnerText').text(`Your final score is ${score}`);
    $('#winnerModal').modal('toggle');
}

// On play method
function play() {
    if (autoSelectedCell) { // If user click on Play while a game in progress not allowing
        return;
    }
    let randomCell = Math.floor(Math.random() * (1 - 1 + totalCells)) + 1;
    if ($('#cell-'+randomCell).hasClass('circle-success')) { // If you get same random which is alrady we hit success then calling as recursion
        return play();
    }
    autoSelectedCell = $('#cell-'+randomCell);
    $(autoSelectedCell).addClass('circle-read-only');
    toggleCell(autoSelectedCell);
}

// toggleCell: To handle showing the circle with actual color
function toggleCell(selector) {
    $(selector).css('background', selector.attr('data-circle-color'));
}

$('.deck').click(event => {
    if (event.target.hasChildNodes() || !autoSelectedCell) { // Allow only if you have randomly selected cell by System.
        return false;
    }
    toggleCell($(event.target));
    
    const timerCallback = (autoSelectedCell.attr('data-circle-color') === $(event.target).attr('data-circle-color'))
                    ? hitSuccess
                    : hitWrong;
    timer = setTimer($(event.target),autoSelectedCell, timerCallback);
})

function setTimer(userSelector, systemSelector, callback) {
    setTimeout(() => {
        callback()(userSelector, systemSelector);
        $('#score span').html(score);
    }, 500);
}

// hitSuccess: To handle all events on successive hit
function hitSuccess() {
    score++;
    return (userSelector, systemSelector) => {
        $(userSelector).addClass('circle-success circle-read-only');
        $(systemSelector).addClass('circle-success circle-read-only');
        $(userSelector).removeAttr('style');
        $(systemSelector).removeAttr('style');
        autoSelectedCell = undefined;
        return (isPlayAllowed()) ? play(): gameOver();
    };
}

// hitSuccess: To handle all events on failure hit
function hitWrong() {
    if (score > 0) {
        score--;
    }
    return (userSelector) => {
        $(userSelector).removeAttr('style');
    }
}

function isPlayAllowed() {
    return $('.circle-success').length !== totalCells;
}

function garbageCleanup() {
    clearTimeout(timer);
}
init();