/** 
 * Rotate pictures plugin.
 * Look Ma, no OOP bulshit.
 **/

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// converts x-aaa-bbb or data-aaa-bbb to aaaBBB
function toCamelCase(name) {
    var parts = name.split('-'),
        capitalised = parts.map(capitaliseFirstLetter);
    return parts.slice(1,2).concat(capitalised.slice(2)).join('');
}

// return hash of all attributes started with 'x-'
function getXAttributes(el) {
    var arr = el.attributes,
        ret = {};
    for(var i = 0; i < arr.length; i++) {
        var attr = arr[i];
        if (attr.name.indexOf('x-') === 0)
            ret[toCamelCase(attr.name)] = attr.value;
    }

    return ret;
}

(function($) {

    var DEFAULTS = {
        warmUpTime: 6000, // time before first fade
        fadeDuration: 5000, // the length of animation 
        slideDuration: 500, // the length of animation 
        rotatePeriod: 5000,  // wait time before next fade 
        arrows: false,
        nextMethod: 'fade'
    };

    
    $.fn.rotate = function(options) {

        function run() {
            var $root = $(this),
                domOptions = getXAttributes(this),
                settings = $.extend({}, DEFAULTS, domOptions, options),
                timedId = null;

            var timedNext = function(delay) {
                clearTimeout(timedId);
                timedId = setTimeout(settings.nextMethod === 'fade' ? fadeNext : slideNext, delay);      
            };

            function fadeNext() {
                $('img:last', $root).animate(
                    {'opacity': 0}, 
                    settings.fadeDuration, 
                    function() {
                        var $this = $(this);
                        $root.prepend($this);
                        $this.css({opacity:1});
                        timedNext(settings.rotatePeriod);
                        loadTriple();
                    });
            }

            function slidePrev() {
                var $first = $('img:first', $root);

                $first.css({'left':'-100%'});
                $root.append($first);
                $first.animate(
                    {'left': '0'}, 
                    settings.slideDuration, 
                    function() {
                        loadTriple();
                        timedNext(settings.rotatePeriod);
                    });
            }

            function slideNext() {
                $('img:last', $root).animate(
                    {'left': '-100%'}, 
                    settings.slideDuration, 
                    function() {
                        var $this = $(this);
                        $root.prepend($this);
                        $this.css({left:0});
                        loadTriple();
                        timedNext(settings.rotatePeriod);
                    });
            }


            // lazy loads pair of images
            function loadTriple() {
              var x = $('img:first', $root).add('img:last', $root).add($('img:last', $root).prev()).each(function() {
                this.setAttribute('src', this.getAttribute('x-src'));
              });
            }

            if (settings.arrows) {
              $root.parent()
                .prepend("<div class='prev'></div>")
                .prepend("<div class='next'></div>");

              $(".prev").on('click', slidePrev);
              $(".next").on('click', slideNext); 
            }

            loadTriple();

            // set last image to relative position to give box a size
            $('img:last', $root).css('position', 'relative');

            timedNext(settings.warmUpTime);
        }

        return this.each(run);
  };
})(jQuery);


$('#maximage').rotate();
$('#slideshow').rotate({arrows:true, nextMethod: 'slide'});

// all elements with x-href attribute are hyper-links
$('*[x-href]').on('click', function() {window.location.href = this.getAttribute('x-href');});

if (location.host.indexOf('kuhinje-erjavec.si') !== -1) {
    setTimeout(
    function(){$('.rant')
    .css({display: 'block'})
        .animate({right: 30}, 500, 'swing');},
        9000);
}
