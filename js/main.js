$(".scrollTo").click(function() {
    $('html, body').animate({
        scrollTop: $("#second-container").offset().top
    }, 2000);
});

var addclass = 'content-selected';
var $cont_selected = $('.proj-list').click(function(e) {
    $(this).addClass(addclass);
});
