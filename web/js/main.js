/*
*
* mads - version 2
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function() {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function() {
    return new Date().getTime();
}


mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){
		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}
	}
}

/* tracker */
mads.prototype.tracker = function (tt, type, name) { console.log(type);

    /* 
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;
    
    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{type}}', type);
            src = src.replace('{{tt}}', tt);
            src = src.replace('{{value}}', '');
            /* */
            img.src = src + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

/*
*
* Unit Testing for mads
*
*/
var testunit = function () {
    var app = new mads();

    app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js',function () {
        //console.log(typeof window.jQuery != 'undefined');
    });

    app.loadCss(app.path+'css/style.css');
    app.loadCss(app.path+'css/njImageSlider.css');
    
    app.contentTag.innerHTML = '<div class="container"> \
        <img id="redux" src="' + app.path + 'img/bg-2.jpg" /> \
        <div class="ob"> \
        <img src="' + app.path + 'img/ob.png" alt=""/> \
        </div> \
        <div id="frame1"> \
        <div class="picture"> \
        <img src="' + app.path + 'img/pict11.png" alt=""/> \
        </div> \
        <div class="finger" id="finger"> \
        <img src="' + app.path + 'img/finger.png" alt=""/> \
        </div> \
        <div class="text-block"> \
        <img src="' + app.path + 'img/text.png" alt=""/> \
        </div> \
        <div class="wipe-tx" id="wipe"> \
        <img src="' + app.path + 'img/wipe-to.png" alt=""/> \
        </div> \
        <div class="btn-find" id="find"> \
        <img class="btn-find2" src="' + app.path + 'img/find-btn.png" alt=""/> \
        </div> \
        </div> \
        <div id="frame2" class="frame2"> \
        <div class="video pos-a"> \
        <div id="yt_frame"></div> \
        </div> \
        <div class="btn-discover" id="stop"> \
        <img class="btn-find3" src="' + app.path + 'img/discover-btn.jpg" alt=""/> \
        </div> \
        </div> \
        <div id="frame3" class="frame3"> \
        <div id="slider" class="sect pos-a"> \
        </div> \
        <div class="btn-watch"> \
        <img src="' + app.path + 'img/btn3.jpg" alt=""/> \
        </div> \
        </div> \
        </div>';
    
    
    var  loadEvent = function()
    {
        $(".container, .hh").mousedown(function(){
            $(".finger, .wipe-tx").hide();
            $(".finger").css({
                display:"none", opacity: "0"
            });
        });
        $(".container, .hh").bind('touchstart touchend', function(){
            $(".finger, .wipe-tx").hide();
            $(".finger").css({
                display:"none", opacity: "0"
            });
            setTimeout(function(){
                $(".container").addClass("cont3");
            }, 3500);
        });
        $("#redux").eraser({
            completeRatio: .5,
            completeFunction: function(){
                
                /* tracker wipe */
                app.tracker('E','wipe');
                
                $('#rma-widget').addClass('transform');
                
                $( "#redux" ).hide();
                $(".container").addClass("cont2");
                setTimeout(function(){
                    $(".container").addClass("cont3");
                }, 2800);
                setTimeout(function(){
                    $(".picture").addClass("pict2");
                }, 2800);
                setTimeout(function(){
                    $(".text-block").addClass("text2");
                }, 3500);
                setTimeout(function(){
                    $(".btn-find").addClass("find2");
                }, 4200);
                $(".btn-find2").click(function(){
                    
                    app.tracker('CTR', 'more');
                    
                    $(".btn-find").css({
                        "display":"none"
                    });
                    $(".frame2").addClass("frame2-2");
                });
                
                $('.btn-watch').click(function(){
                    app.linkOpener('http://watchod.com/');
                    app.tracker('CTR','site');
                });
                
                $(".btn-discover").click(function(){
                    
                    new njImageSlider({
                        'container' : document.getElementById('slider'),
                        'images' : [
                            {
                                'src': app.path + 'img/slider-1.png',
                                'landing': "http://watchod.com/"
                            },
                            {
                                'src': app.path + 'img/slider-2.png',
                                'landing': "http://watchod.com/"
                            },
                            {
                                'src': app.path + 'img/slider-3.png',
                                'landing': "http://watchod.com/"
                            },
                        ],
                        'width' : 320,
                        'height' : 200,
                        'auto' : true,
                        'tracker' : app       
                    });
                    
                    $(".frame3").addClass("frame3-2");
                    $(".frame2-2").css({
                        "display":"none"
                    });
                });
                $('#stop').on('click', function() {
                    
                    app.tracker('CTR', 'discover');
                    
                    //$('#popup-youtube-player').stopVideo();
                    $('#yt_frame')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
                });

            }
        });
    }

    var jsAnimation = function(){
        app.loadJs(app.path+'js/js-animation.js',  loadEvent);
        app.loadJs(app.path+'js/ninjoe.ytComponent.js');
        app.loadJs(app.path+'js/njImageSlider.js');
    }

    app.loadJs('https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js', jsAnimation);
   // app.custTracker = ['http://www.tracker.com?type=','http://www.tracker2.com?type='];

   // app.tracker('test');

   // app.linkOpener('http://www.google.com');
}
testunit();