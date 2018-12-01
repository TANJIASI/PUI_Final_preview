$(".btn").removeClass("btn-outline-light");
$(".btn").addClass("btn-outline-dark");

var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#ffffff";
var animations = [];
var circles = [];

var colorPicker = (function() {
    var colors = ["#cddc39", "#ffc107", "#ff5722", "#c2185b", "#7b1fa2", "#26a69a"];

    var index = 0;
    function next() {
        index = index++ < colors.length-1 ? index : 0;
        return colors[index];
    }
    function current() {
        return colors[index];
    }
    return {
        next: next,
        current: current
    }
})();

// self-added
var textPicker = (function() {
    var colortext = ["YELLOW-ORANGE", "ORANGE-RED", "RED-VIOLET", "VIOLET-BLUE", "BLUE-GREEN", "GREEN-YELLOW"];

    var index = 0;
    function next() {
        index = index++ < colortext.length-1 ? index : 0;
        return colortext[index];
    }
    function current() {
        return colortext[index];
    }
    return {
        next: next,
        current: current
    }
})();
var descriptionPicker = (function() {
    var colordescription = ["Yellow-orange is the resultant color when blending the primary color yellow and the secondary color orange. It is the color of joy and creativity.",
                        "Orange-red is the resultant color when blending the primary color red and the secondary color orange. It is stimulating, vibrant, and flamboyant.",
                        "Red-violet is the resultant color when blending the primary color red and the secondary color violet. It could represent meanings of wealth, extravagance, creativity, wisdom, dignity, grandeur.",
                        "Violet-blue is the resultant color when blending the primary color blue and the secondary color violet. It could represent meanings of devotion, peace, pride, mystery, independence, and magic.",
                        "Blue-green is the resultant color when blending the primary color blue and the secondary color green. Blue-green communicates significance, importance, and confidence without creating somber or sinister feelings.",
                        "Green-yellow is the resultant color when blending the primary color yellow and the secondary color green. It has healing power and is understood to be the most restful and relaxing color for the human eye to view."
    ];
    var index = 0;
    function next() {
        index = index++ < colordescription.length-1 ? index : 0;
        return colordescription[index];
    }
    function current() {
        return colordescription[index];
    }
    return {
        next: next,
        current: current
    }
})();


function removeAnimation(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
    var l = Math.max(x - 0, cW - x);
    var h = Math.max(y - 0, cH - y);
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
    document.addEventListener("touchstart", handleEvent);
    document.addEventListener("mousedown", handleEvent);
};

function handleEvent(e) {

    // after the background become colorful
    // change the class of the button to light
    $(".btn").removeClass("btn-outline-dark");
    $(".btn").addClass("btn-outline-light");

    if (e.touches) {
        e = e.touches[0];
    }

    if (e.pageY > 100) {


        var currentColor = colorPicker.current();
        var nextColor = colorPicker.next();

        // self-added
        var currentText = textPicker.current();
        var nextText = textPicker.next();
        var currentDescription = descriptionPicker.current();
        var nextDescription = descriptionPicker.next();

        var targetR = calcPageFillRadius(e.pageX, e.pageY);
        var rippleSize = Math.min(200, (cW * .4));
        var minCoverDuration = 750;

        var pageFill = new Circle({
            x: e.pageX,
            y: e.pageY,
            r: 0,
            fill: nextColor
        });
        var fillAnimation = anime({
            targets: pageFill,
            r: targetR,
            duration: Math.max(targetR / 2, minCoverDuration),
            easing: "easeOutQuart",
            complete: function () {
                bgColor = pageFill.fill;
                removeAnimation(fillAnimation);
            }
        });

        var ripple = new Circle({
            x: e.pageX,
            y: e.pageY,
            r: 0,
            fill: currentColor,
            stroke: {
                width: 3,
                color: currentColor
            },
            opacity: 1
        });
        var rippleAnimation = anime({
            targets: ripple,
            r: rippleSize,
            opacity: 0,
            easing: "easeOutExpo",
            duration: 900,
            complete: removeAnimation
        });

        var particles = [];
        for (var i = 0; i < 32; i++) {
            var particle = new Circle({
                x: e.pageX,
                y: e.pageY,
                fill: currentColor,
                r: anime.random(24, 48)
            })
            particles.push(particle);
        }
        var particlesAnimation = anime({
            targets: particles,
            x: function (particle) {
                return particle.x + anime.random(rippleSize, -rippleSize);
            },
            y: function (particle) {
                return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
            },
            r: 0,
            easing: "easeOutExpo",
            duration: anime.random(1000, 1300),
            complete: removeAnimation
        });
        animations.push(fillAnimation, rippleAnimation, particlesAnimation);
        // console.log(currentText);

        // self-added
        $("#color-text").text(currentText);
        $(".color-description").text(currentDescription);

    }
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
}

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
    ctx.globalAlpha = 1;
}

var animate = anime({
    duration: Infinity,
    update: function() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cW, cH);
        animations.forEach(function(anim) {
            anim.animatables.forEach(function(animatable) {
                animatable.target.draw();
            });
        });
    }
});

var resizeCanvas = function() {
    cW = window.innerWidth;
    cH = window.innerHeight;
    c.width = cW * devicePixelRatio;
    c.height = cH * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init() {
    resizeCanvas();
    if (window.CP) {
        window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000;
    }
    window.addEventListener("resize", resizeCanvas);
    addClickListeners();
    if (!!window.location.pathname.match(/fullcpgrid/)) {
        startFauxClicking();
    }
    // handleInactiveUser();
})();

function handleInactiveUser() {
    var inactive = setTimeout(function(){
        fauxClick(cW/2, cH/2);
    }, 2000);

    function clearInactiveTimeout() {
        clearTimeout(inactive);
        document.removeEventListener("mousedown", clearInactiveTimeout);
        document.removeEventListener("touchstart", clearInactiveTimeout);
    }

    document.addEventListener("mousedown", clearInactiveTimeout);
    document.addEventListener("touchstart", clearInactiveTimeout);
}

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
