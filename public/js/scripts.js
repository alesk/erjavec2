/** 
 * Rotate pictures plugin.
 * Look Ma, no OOP bulshit.
 **/

(function($) {

    $.fn.rotate = function(options) {
        var settings = $.extend({
            warmUpTime: 6000, // time before first fade
            fadeDuration: 5000, // the length of animation 
            rotatePeriod: 5000  // wait time before next fade
            }, options);

        function run() {
            var $parent = $(this);

            function fadeNext() {
                $('img:last', $parent).animate(
                    {'opacity': 0}, 
                    settings.fadeDuration, 
                    function() {
                        var $this = $(this);
                        $parent.prepend($this);
                        $this.css({opacity:1});
                        setTimeout(fadeNext, settings.rotatePeriod);
                    });
            }

            setTimeout(fadeNext, settings.warmUpTime);      
        }

        return this.each(run);
  }
})(jQuery);


$('#maximage').rotate();
