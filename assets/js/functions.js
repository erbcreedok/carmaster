var toggleClass = function(selector, className) {
  $(selector).toggleClass(className);
};

$( document ).ready(function() {
    var nav = $('nav');
    var navItems = $('.navbar .main-nav li');

    var navbarCheck = function() {
        nav.toggleClass('navbar-filled', window.scrollY > 0);
    }

    navbarCheck();

    $('.navbar .main-nav li a').bind('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var elementOffset = document.querySelector(id).offsetTop;
        $('html, body').animate({
            scrollTop: elementOffset - 10
        }, '1000');
    });

    $(document).scroll(function() {
        navbarCheck();
    });

    var checkWaypoint = function(waypoint) {
        if (!waypoint.element.dataset.waypoint) return;
        var hash = waypoint.element.dataset.waypoint;
        var noOne = true;
        $.each(navItems, function(i) {
            var b = $(this).children('a').attr('href').slice(1) === hash;
            $(this).toggleClass('active', b);
            if (b && i!==0) {
                noOne = false;
            }
        });
        $(navItems[0]).toggleClass('active', noOne);
    };

    var sections = $('section');

    //Waypoint directions UP
    sections.waypoint(function(direction) {
        if (direction === 'up') {
            checkWaypoint(this);
        }
    }, { offset: 0 });

    //Waypoint directions UP
    sections.waypoint(function(direction) {
        if (direction === 'down') {
            checkWaypoint(this);
        }
    }, { offset: 20 });

    $('.worker-cards').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: true,
        responsive: [{
            breakpoint: 767.99,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        }]
    });

    $('.review-cards').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: true,
        responsive: [{
            breakpoint: 767.99,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true,
                adaptiveHeight: true
            }
        }]
    });

    $('.photos-container').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: true,
        responsive: [{
            breakpoint: 767.99,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        }]
    });

    $('.partners').slick({
        slidesToShow: 8,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
        responsive: [{
            breakpoint: 767.99,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        }]
    });
});
