// Reference: Anime.js fireworks canvas demo
// https://codepen.io/juliangarnier/pen/gmOwJX


// initializing global variables
var c = document.getElementById("c-left");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#ffffff";
var animations = [];
var activeCanvas = null;

// after the page is loaded, detect button click events
$(document).ready(function () {
    var colorLeft = null;
    var colorRight = null;
    $(".btns-left button").removeClass("btn-outline-light");
    $(".btns-left button").addClass("btn-outline-dark");
    $(".btns-right button").removeClass("btn-outline-light");
    $(".btns-right button").addClass("btn-outline-dark");

    // when left buttons are clicked, change the color of the left canvas
    $(".color-left").click(function (e){
        // if the "mixed" button has been clicked before, when clicked on the color buttons, set the background back to transparent
        $("#mix-color").css({"background-color": "rgba(255,255,255,0.5)"});

        // once the canvas color is not white, change the button to a different class
        $(".btns-left button").removeClass("btn-outline-dark");
        $(".btns-left button").addClass("btn-outline-light");

        // set the selected button as highlighted
        $(".btns-left .btn").css({"font-weight": "normal", "border": "1px solid white"});
        $("#"+this.id).css({"font-weight": "normal", "border": "1px solid black"});

        // set ctx to current canvas
        c = document.getElementById("c-left");
        ctx = c.getContext("2d");
        activeCanvas = "left";

        // set desired color
        var color = $(this).text();
        colorLeft = color;
        colorLeft = changeColor(color);

        // refresh canvas
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        if (!!window.location.pathname.match(/fullcpgrid/)) {
            startFauxClicking();
        }

        // handle touch event
        handleEvent(e);
    }) ;

    $(".color-right").click(function (e) {
        // if the "mixed" button has been clicked before, when clicked on the color buttons, set the background back to transpar
        $("#mix-color").css({"background-color": "rgba(255,255,255,0.5)"});

        // once the canvas color is not white, change the button to a different class
        $(".btns-right button").removeClass("btn-outline-dark");
        $(".btns-right button").addClass("btn-outline-light");

        // set the selected button as highlighted
        $(".btns-right .btn").css({"font-weight": "normal", "border": "1px solid white"});
        $("#"+this.id).css({"font-weight": "normal", "border": "1px solid black"});

        // set ctx to current canvas
        c = document.getElementById("c-right");
        ctx = c.getContext("2d");
        activeCanvas = "right";

        // set the desired color
        var color = $(this).text();
        colorRight = color;
        colorRight = changeColor(color);

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        if (!!window.location.pathname.match(/fullcpgrid/)) {
            startFauxClicking();
        }

        // handle touch event
        handleEvent(e);
    }) ;

    // when mix! is clicked, set the button to be highlighted until the colors buttons are clicked again
    $("#mix-color").click(function () {
        // reset both canvas to prevent a situation:
        // when the right canvas is set before the left canvas, left canvas will change to the same color as the right one
        var cl = document.getElementById("c-left");
        var ctxl = cl.getContext("2d");
        var cr = document.getElementById("c-right");
        var ctxr = cr.getContext("2d");
        ctxr.fillStyle = colorRight;
        ctxr.fillRect(0, 0, cW, cH);
        ctxl.fillStyle = colorLeft;
        ctxl.fillRect(0, 0, cW, cH);

        // set the middle circles to both color, stacked together, to produce the mixed color
        $(".mixed-color-left").css({"background-color": colorLeft, "opacity":0.5});
        $(".mixed-color-right").css({"background-color": colorRight, "opacity":0.5});
        $("#mix-color").css({"background-color": "#090e1f"})
    });

});

// change color from the button text to hex value
function changeColor(color) {
    var colorHex = null;
    switch (color) {
        case "Yellow":
            colorHex = "#FFD54F";
            break;
        case "Red":
            colorHex = "#F44336";
            break;
        case "Blue":
            colorHex = "#81D4FA";
            break;
        case "Green":
            colorHex = "#aed581";
            break;
        case "Orange":
            colorHex = "#ff9800";
            break;
        case "Violet":
            colorHex = "#972cb0";
            break;
        case "Red-Orange":
            colorHex = "#ff5722";
            break;
        case "Yellow-Orange":
            colorHex = "#ffc107";
            break;
        case "Yellow-Green":
            colorHex = "#cddc39";
            break;
        case "Blue-Green":
            colorHex = "#26a69a";
            break;
        case "Blue-Violet":
            colorHex = "#7b1fa2";
            break;
        case "Red-Violet":
            colorHex = "#c2185b";
            break;
        default:
            colorHex = "#ffffff";
    }

    bgColor = colorHex;
    return colorHex;
}

// function for removing animation
function removeAnimation(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
}

//
function calcPageFillRadius(x, y) {
    var l = Math.max(x - 0, cW - x);
    var h = Math.max(y - 0, cH - y);
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

// function handle event
// get touch x and y
function handleEvent(e) {
    if (e.touches) {
        e.preventDefault();
        e = e.touches[0];
    }
    var pageX = e.pageX;
    var pageY = e.pageY;
    if(activeCanvas === "right"){
        pageX = e.pageX - window.innerWidth / 2;
        console.log("pageX", pageX);
    }
    console.log("pageY", pageY);
    var targetR = calcPageFillRadius(pageX, pageY);
    console.log("targetR", targetR);
    var rippleSize = Math.min(200, (cW * .4));
    var minCoverDuration = 1000;

    // define page fill animation
    var pageFill = new Circle({
        x: pageX,
        y: pageY,
        r: 0,
        fill: bgColor,
        opacity: 1
    });
    var fillAnimation = anime({
        targets: pageFill,
        r: targetR,
        duration:  Math.max(targetR / 2 , minCoverDuration ),
        easing: "easeOutQuart",
        opacity: 1,
        complete: function(){
            bgColor = pageFill.fill;
            removeAnimation(fillAnimation);
        }
    });

    // define ripple animation
    var ripple = new Circle({
        x: pageX,
        y: pageY,
        r: 0,
        fill: bgColor,
        stroke: {
            width: 3,
            color: bgColor
        },
        opacity: 1
    });
    var rippleAnimation = anime({
        targets: ripple,
        r: 0,
        opacity: 1,
        easing: "easeOutExpo",
        duration: 2000,
        complete: removeAnimation
    });

    // define particle animation
    var particles = [];
    for (var i=0; i<32; i++) {
        var particle = new Circle({
            x: pageX,
            y: pageY,
            fill: "#ffffff",
            r: anime.random(24, 48)
        });
        particles.push(particle);
    }
    var particlesAnimation = anime({
        targets: particles,
        x: function(particle){
            return particle.x + anime.random(rippleSize, -rippleSize);
        },
        y: function(particle){
            return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
        },
        r: 0,
        easing: "easeOutExpo",
        duration: anime.random(1000,1300),
        complete: removeAnimation
    });

    // push animations
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function extend(a, b){
    for(var key in b) {
        if(b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

//
var Circle = function(opts) {
    extend(this, opts);
};

Circle.prototype.draw = function() {
    ctx.globalAlpha = this.opacity || 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    if (this.stroke) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
        ctx.stroke();
    }
    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }
    ctx.closePath();
    ctx.globalAlpha = 0.5;
};

// define animation functions
var animate = anime({
    duration: Infinity,
    update: function() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cW, cH);
        ctx.globalAlpha = 0.5;
        animations.forEach(function(anim) {
            anim.animatables.forEach(function(animatable) {
                animatable.target.draw();
            });
        });
    }
});

// function resize canvas
var resizeCanvas = function() {
    cW = window.innerWidth / 2;
    cH = window.innerHeight;
    c.width = cW * devicePixelRatio;
    c.height = cH * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
};

// click event
function startFauxClicking() {
    setTimeout(function(){
        fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
        startFauxClicking();
    }, anime.random(20, 90));
}
function fauxClick(x, y) {
    var fauxClick = new Event("mousedown");
    fauxClick.pageX = x;
    fauxClick.pageY = y;
    document.dispatchEvent(fauxClick);
}