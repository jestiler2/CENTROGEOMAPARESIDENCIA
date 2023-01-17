function generateLetter () {
    let letter = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
    let random = (Math.random()*15).toFixed(0);
    return letter[random];
}

function generateRandomColor (extend) {
    let color = "";
    for(let i = 0; i < 6; i++){
        color = color + generateLetter() ;
    }

    if (extend) {
        return "#" + color;
    } else {
        return color;
    }
}
