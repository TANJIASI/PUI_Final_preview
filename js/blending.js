// var cl = document.getElementById("c-left");
// var cr = document.getElementById("c-right");
var c = document.getElementById("c-left");
var ctx = c.getContext("2d");
// var ctxr = cr.getContext("2d");
var cH;
var cW;
var bgColor = "#ffffff";
var animations = [];
// var circles = [];


var activeCanvas = null;

$(document).ready(function () {
    var colorLeft = null;
    var colorRight = null;

    $(".btns-left button").removeClass("btn-outline-light");
    $(".btns-left button").addClass("btn-outline-dark");
    $(".btns-right button").removeClass("btn-outline-light");
    $(".btns-right button").addClass("btn-outline-dark");

    $(".color-left").click(function (e) {
        // console.log(e);



        $(".btns-left button").removeClass("btn-outline-dark");
        $(".btns-left button").addClass("btn-outline-light");

        console.log("this.id",this.id);
        // this.parentElement.children.css({"font-weight": "regular", "border": "1px solid white"});

        $(".btns-left .btn").css({"font-weight": "normal", "border": "1px solid white"});
        $("#"+this.id).css({"font-weight": "bold", "border": "4px solid white"});



        c = document.getElementById("c-left");
        ctx = c.getContext("2d");
        activeCanvas = "left";
        var color = $(this).text();

        colorLeft = color;
        console.log("clicked left"); // NSH
        console.log(color);
        colorLeft = changeColor(color);

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);
        // addClickListeners();
        if (!!window.location.pathname.match(/fullcpgrid/)) {
            startFauxClicking();
        }

        handleEvent(e);
        // var mixedColor = mixColor(colorLeft, colorRight);
        // $("#mixed-color").css({"background-color": mixedColor});
        // $("#mixed-color-left").css({"background-color": changeColor(colorLeft), "opacity":0.5});
    }) ;


    $(".color-right").click(function (e) {

        $(".btns-right .btn").css({"font-weight": "normal", "border": "1px solid white"});
        $("#"+this.id).css({"font-weight": "bold", "border": "4px solid white"});

        // ctx = cr.getContext("2d");
        $(".btns-right button").removeClass("btn-outline-dark");
        $(".btns-right button").addClass("btn-outline-light");

        c = document.getElementById("c-right");
        ctx = c.getContext("2d");

        console.log(ctx);
        activeCanvas = "right";
        var color = $(this).text();
        colorRight = color;
        console.log("clicked right"); // NSH
        console.log(color);
        colorRight = changeColor(color);

        resizeCanvas();

        window.addEventListener("resize", resizeCanvas);
        if (!!window.location.pathname.match(/fullcpgrid/)) {
            startFauxClicking();
        }
        handleEvent(e, ctx);

        // var mixedColor = mixColor(colorLeft, colorRight);

        // $("#mixed-color").css({"background-color": mixedColor});
        // $("#mixed-color-right").css({"background-color": changeColor(colorRight), "opacity":0.5});
    }) ;

    $("#mix-color").click(function () {
        console.log("Clicked Mix!"); // NSH
        console.log("Left color is " + colorLeft);
        console.log("Right color is " + colorRight);

        var cl = document.getElementById("c-left");
        var ctxl = cl.getContext("2d");
        var cr = document.getElementById("c-right");
        var ctxr = cr.getContext("2d");

        ctxr.fillStyle = colorRight;
        ctxr.fillRect(0, 0, cW, cH);

        ctxl.fillStyle = colorLeft;
        ctxl.fillRect(0, 0, cW, cH);


        $(".mixed-color-left").css({"background-color": colorLeft, "opacity":0.5});
        $(".mixed-color-right").css({"background-color": colorRight, "opacity":0.5});


    });

    $("#clear-color").click(function () {
        $("#mixed-color-left").css({"background-color": "#fff", "opacity":0.5});
        $("#mixed-color-right").css({"background-color": "#fff", "opacity":0.5});
    })

});



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
        // default:
        //     colorHex = "#ffffff";
    }

    bgColor = colorHex;

    return colorHex;

}


// function mixColor (colorLeft, colorRight) {
//     var colors = [colorLeft, colorRight];
//     var resultColor = null;
//     if (colorLeft === null || colorRight ===null) {
//         resultColor = "#aaaaaa";
//     } else {
//
//         if (colors[0] === colors[1]) {
//             resultColor = colors[0];
//         }
//
//         if (colors.indexOf("Red")!==-1 && colors.indexOf("Blue") !== -1) {
//             // resultColor = "#972cb0"; // Violet
//             resultColor = "Violet";
//         }
//
//         if (colors.indexOf("Yellow")!==-1 && colors.indexOf("Blue") !== -1) {
//             // resultColor = "#aed581"; //Green
//             resultColor = "Green";
//         }
//
//         if (colors.indexOf("Yellow")!==-1 && colors.indexOf("Red") !== -1) {
//             // resultColor = "#ff9800"; //Orange
//             resultColor = "Orange";
//         }
//
//         if (colors.indexOf("Red")!==-1 && colors.indexOf("Orange") !== -1) {
//             // resultColor = "#ff5722"; // Red-Orange
//             resultColor = "Red-Orange";
//         }
//
//         if (colors.indexOf("Yellow")!==-1 && colors.indexOf("Orange") !== -1) {
//             resultColor = "#ffc107"; // Yellow-Orange
//             resultColor = "Yellow-Orange";
//         }
//
//         if (colors.indexOf("Yellow")!==-1 && colors.indexOf("Green") !== -1) {
//             resultColor = "#cddc39"; // Yellow-Green
//             resultColor = "Yellow-Green";
//         }
//
//         if (colors.indexOf("Blue")!==-1 && colors.indexOf("Green") !== -1) {
//             resultColor = "#26a69a"; // Blue-Green
//             resultColor = "Blue-Green";
//         }
//
//         if (colors.indexOf("Blue")!==-1 && colors.indexOf("Violet") !== -1) {
//             resultColor = "#7b1fa2"; // Blue-Violet
//             resultColor = "Blue-Violet";
//         }
//
//         if (colors.indexOf("Red")!==-1 && colors.indexOf("Violet") !== -1) {
//             resultColor = "#c2185b"; // Red-Violet
//             resultColor = "Red-Violet";
//         }
//
//     }
//
//     console.log("result color:", resultColor);
//     resultColor = changeColor(resultColor);
//
//     return resultColor;
//
//
// }




function removeAnimation(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
    var l = Math.max(x - 0, cW - x);
    var h = Math.max(y - 0, cH - y);
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}


function handleEvent(e) {
    if (e.touches) {
        e.preventDefault();
        e = e.touches[0];

        // console.log(e);
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

    var pageFill = new Circle({
        x: pageX,
        y: pageY,
        r: 0,
        fill: bgColor,
        opacity: 1
    });
    console.log("pageFill", pageFill);
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
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
    // console.log(currentText);


}

function extend(a, b){
    for(var key in b) {
        if(b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

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

var resizeCanvas = function() {
    cW = window.innerWidth / 2;
    cH = window.innerHeight;

    c.width = cW * devicePixelRatio;
    c.height = cH * devicePixelRatio;

    // cl.width = cW * devicePixelRatio;
    // cl.height = cH * devicePixelRatio;
    // cr.width = cW * devicePixelRatio;
    // cr.height = cH * devicePixelRatio;

    ctx.scale(devicePixelRatio, devicePixelRatio);
};


// function handleInactiveUser() {
//     var inactive = setTimeout(function(){
//         fauxClick(200, 300);
//     }, 2);
//
//     function clearInactiveTimeout() {
//         clearTimeout(inactive);
//         document.removeEventListener("mousedown", clearInactiveTimeout);
//         document.removeEventListener("touchstart", clearInactiveTimeout);
//     }
//
//     document.addEventListener("mousedown", clearInactiveTimeout);
//     document.addEventListener("touchstart", clearInactiveTimeout);
// }

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


// select the correct target by class or by id
// var cssSelector = anime({
//     targets: '.btns-left', //select by class
//     translateX: 250,
//
// });

// var restartAnim = anime({
//     targets: '.btns-left',
//     translateX: 250,
//     delay: function(el, i, l) { return i * 100; },
//     direction: 'alternate',
//     loop:
// });
