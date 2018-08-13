// wait until DOM is ready
$( document ).ready(function() {

    // wait until images, links, style-sheets, and other assets are loaded
    $( window ).load(function() {

       // remove loader class
       // I use tweenmax delayedCall() instead of setTimout()
       // just so you can see the loader and see it removed
       // do not use for production
       TweenMax.delayedCall(3, function(){
           $("#wrapper").removeClass("loader");

           TweenMax.to("#wrapper-inner",2,{autoAlpha:1})
       });

       // your tweens


    });

});
