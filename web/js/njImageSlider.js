/*
*
* njSwipe - version 1.00.00  
* Native Javascript
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var njSwipe = function (ele, direction) {
    
    this.ele = ele;
    this.direction = direction;
    
    this.startX;
    this.startY;
    this.startTime;
    this.allowedTime = 300;
    this.threshold = 150;
    this.restraint = 100;
    
    this.bindEvents();
}

/*
* Javascript Currying 
* For more info - http://www.dustindiaz.com/javascript-curry/
*/
njSwipe.prototype.curry = function(fn, scope /*, arguments */) {
    scope = scope || window;
    var actualArgs = arguments;

    return function() {
        var args = [];
        for(var j = 0; j < arguments.length; j++) {
            args.push(arguments[j]);
        }

        for(var i = 2; i < actualArgs.length; i++) {
            args.push(actualArgs[i]);
        }

        return fn.apply(scope, args);
    };
};

/* Add touch events to DOM element */
njSwipe.prototype.bindEvents = function () { 
    this.ele.addEventListener('touchstart', this.curry(this.touchStart, this));
    this.ele.addEventListener('mousedown', this.curry(this.touchStart, this));
    
    this.ele.addEventListener('touchmove', this.curry(this.touchMove, this));
    this.ele.addEventListener('mousemove', this.curry(this.touchMove, this));
    
    this.ele.addEventListener('touchend', this.curry(this.touchEnd, this));
    this.ele.addEventListener('mouseup', this.curry(this.touchEnd, this));
};

/* Function on touchstart event */
njSwipe.prototype.touchStart = function (e) {
    e.preventDefault();
    
    var touch = e.type == 'touchstart' ? e.changedTouches[0] : e;
    this.startX = touch.pageX;
    this.startY = touch.pageY;
    this.startTime = new Date().getTime();
    
};

/* Function on touchmove event */
njSwipe.prototype.touchMove = function (e) {
    e.preventDefault();
};

/* Function on touchend event */
njSwipe.prototype.touchEnd = function (e) {
    e.preventDefault();
    
    var touch = e.type == 'touchend' ? e.changedTouches[0] : e;
    var distX = touch.pageX - this.startX;
    var distY = touch.pageY - this.startY;
    var endTime = new Date().getTime() - this.startTime;
    var direction;
    
    /* Check the time between touch start and end is within the allowed time */ 
    if ( endTime <= this.allowedTime ) {
        /* Get the direction */
        if ( Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint ) {
            direction = distX < 0 ? 'swipeleft' : 'swiperight';
        } else if ( Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint ) {
            direction = distY < 0 ? 'swipeup' : 'swipedown';
        }
    }
    
    this.triggerEvent(direction);
    
};

njSwipe.prototype.triggerEvent = function (direction) {
    
    if ( this.direction == direction) {
        
        var event = new Event (direction);
        this.ele.dispatchEvent(event);
    }
};

(function() {
    
    /* keep a reference to the original method */
    var orig_addEventListener = Element.prototype.addEventListener;

    Element.prototype.addEventListener = function (type, listener, useCapture) {
        
        /* Extended Scripts */
        if (type == 'swipeleft' || type == 'swiperight' || type == 'swipeup' || type == 'swipedown') {
            new njSwipe(this, type);
        }
        
        /* call the original method */
        return orig_addEventListener.call(this, type, listener, useCapture);  
    };
    
    
}());


/*
*
* njImageSlider - version 1.00.00  
* Native Javascript
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var njImageSlider = function(options) {
    this.container = options.container;
    this.width = options.width;
    this.height = options.height;

    this.tracker = options.tracker || function () {};
    
    this.images = options.images;
    
    if (typeof options.animation == 'undefined' || options.animation == '') {
        this.animation = 'slide';
    }

    this.auto = typeof options.auto != 'undefined' || options.auto ? true : false;
    
    this.animations = {
        'slide' : {
            'next' : ['slideOutLeft', 'slideInRight'],
            'prev' : ['slideOutRight', 'slideInLeft']
        }
    };
    
    /* DOM */
    this.next;
    this.prev;

    this.render();
    this.events();
    
    /* Init Auto Slides */
    if (this.auto) {
        this.autoSlides();
    }
}
njImageSlider.prototype.render = function() {

    var slides = '';

    for (var i = 0; i < this.images.length; i++) {

        var current = '';
        if (i == 0) {
            current = 'current';
        }

        if (typeof this.images[i].landing == 'undefined' || this.images[i].landing == '') {
            this.images[i].landing = '#';
        }
        
        slides += 
            '<li id="njImage-' + i + '" class="' + current + '"> \
                <div class="slide"> \
                <a href="' + this.images[i].landing + '" target="_blank"> \
                    <img id="imgSource' + i + '" src="' + this.images[i].src + '" style="width:' + this.width + 'px;height:' + this.height + 'px"/> \
                </a> \
                </div>\
            </li>';
    }

    this.container.innerHTML = 
        '<div id="njImage-container" style="width:' + this.width + 'px;height:' + this.height + 'px;">\
            <div class="nav"> \
                <label id="njImage-prev" class="arrows prev">&#x2039;</label>\
                <label id="njImage-next" class="arrows next">&#x203a;</label>\
            </div>\
            <div id="njImage-wrapper"><ul>' + slides + '</ul></div>\
        </div>';
    
    
}

njImageSlider.prototype.events = function () {
    
    var _this = this; 
    
    this.next = document.getElementById('njImage-next');
    this.prev = document.getElementById('njImage-prev');

    /* Next */
    document.getElementById('njImage-next').addEventListener('click', function() {
        
        /* Stop auto slides */
        _this.auto = false;
        
        _this.slideLeft();

    });
    /* Prev */
    this.prev.addEventListener('click', function() {
        
        /* Stop auto slides */
        _this.auto = false;
        
        _this.slideRight();
    });

    /* Swipe Event */
    document.getElementById('njImage-wrapper').addEventListener('swiperight', function () {
        _this.slideRight();
    });
    document.getElementById('njImage-wrapper').addEventListener('swipeleft', function () {
        _this.slideLeft();
    });
}

njImageSlider.prototype.autoSlides = function() {
    
    var _this = this; 
    
    var i = 0;
    
    var slides = setInterval(function () {
        
        if (_this.auto) {
            _this.slideLeft();
        }
        
        if (i == 2 || !_this.auto) {
            clearInterval(slides);
        }
        
        i++;
    },5000);
}

njImageSlider.prototype.slideLeft = function () {
    
    var _this = this;
    
    this.tracker.tracker('E', 'pagination');
    
    var c = document.getElementsByClassName('current')[0]
    c.className = 'animated ' + _this.animations[_this.animation].next[0];

    if (c.nextSibling != null) {
        c.nextSibling.className = 'animated current ' + _this.animations[_this.animation].next[1];
    } else {
        c.parentNode.childNodes[0].className = 'animated current ' + _this.animations[_this.animation].next[1];
    }
}
njImageSlider.prototype.slideRight = function () {
    
    var _this = this;
    
    this.tracker.tracker('E', 'pagination');
    
    var c = document.getElementsByClassName('current')[0]
    c.className = 'animated ' + _this.animations[_this.animation].prev[0];

    if (c.previousSibling != null) {
        c.previousSibling.className = 'animated current ' + _this.animations[_this.animation].prev[1];;
    } else {
        c.parentNode.childNodes[c.parentNode.childNodes.length - 1].className = 'animated current ' + _this.animations[_this.animation].prev[1];;
    }
}



