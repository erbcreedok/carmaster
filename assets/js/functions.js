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

    $('.navbar .main-nav li a, a.slide-to').bind('click', function(e) {
        e.preventDefault();
        var id = $(this).attr('href');
        var elementOffset = document.querySelector(id).offsetTop;
        var diff = Math.abs(document.querySelector('html').scrollTop - elementOffset) / 2;
        console.log(diff);
        $('html, body').animate({
            scrollTop: elementOffset - 10
        }, diff < 600 ? 600 : diff);
    });

    $(document).scroll(function() {
        navbarCheck();
    });

    $('.navbar .main-nav li a').on('click', function(e) {
        setTimeout(function() {
            $("#mainNavbar").collapse('hide');
        }, 300);
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
        arrows: false,
        dots: (function(){
            return $('.worker-cards').children().length > 3;
        })(),
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
        arrows: false,
        dots: (function(){
            return $('.review-cards').children().length > 3;
        })(),
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
        arrows: false,
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
        arrows: false,
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

    $('input[name="phone"]').inputmask("+7 (799) 999 99 99");

    $('.callbackForm').submit(function(e) {
        e.preventDefault();
        var nameElement = this.elements.name;
        var phoneElement = this.elements.phone;
        var name = nameElement.value.trim();
        var phone = phoneElement.value.trim();
        var valid = true;
        var nameRegex = /^[a-zA-Zа-яА-Я][^#&<>\"~;$^%{}?]{1,30}$/;
        if (!nameRegex.test(name)) {
            nameElement.classList.add('no-valid');
            valid = false;
        } else {
            nameElement.classList.remove('no-valid');
        }
        var phoneRegex = /^\+7 \((700|701|702|705|707|708|711|712|713|714|715|717|718|721|722|723|724|725|726|727|747|750|751|760|761|762|763|764|771|775|776|777|778)\) [0-9]{3} [0-9]{2} [0-9]{2}$/;
        if (!phoneRegex.test(phone)) {
            phoneElement.classList.add('no-valid');
            valid = false;
        } else {
            phoneElement.classList.remove('no-valid');
        }
        if (!valid) return;

        sendMessage(this, name, phone);

    });

    var sendMessage = function(form, name, phone) {
        var message = '💡Новая заявка от ' + name;
        message += '\n    <i> Телефон: </i> ' + phone;
        message = encodeURIComponent(message);
        var src = 'https://api.telegram.org/bot' + Globals.botApi + '/sendMessage?chat_id=' + Globals.chatId + '&parse_mode=html&text=' + message;
        var srcMail = 'http://carmaster.kz/sendmail.php';
        $('.ajax-status').html('Отправляем <span class="icon-spinner spin-me" style="display: inline-block;"></span>');
        $(form).attr('disabled', true);
        $(form.elements).attr('disabled', true);
        $('.user-name-here').html(name);
        $.get(src, function() {
            $('.ajax-status').html('Отправлено <span class="icon-checkmark" style="display: inline-block;"></span>');
            setTimeout(function () {
                $('.form-fade-out').fadeOut(function () {
                    $(form).attr('disabled', false);
                    $(form.elements).attr('disabled', false);
                    $(form.elements).val('');
                    $('.ajax-status').html('Отправить');
                    $('#callbackModal').modal('show');
                    $('.thanks-fade-in').fadeIn(function () {
                        setTimeout(function () {
                            $('#callbackModal').modal('hide');
                            $('.thanks-fade-in').fadeOut(function () {
                                $('.form-fade-out').fadeIn();
                            });
                        }, 3500);
                    })
                });
            }, 300)

        });
        $.post(srcMail, {subject: 'Заявка от ' + name, message: message}, function (response) {
            console.log(response);
        });
    };

    $('.form-go-back').click(function() {
        $('.thanks-fade-in').fadeOut(function () {
            $('.form-fade-out').fadeIn();
        });
    });

    var services = {
        serviceList: $('.service-list'),
        isMobile: function() { return window.innerWidth < 768; },
        lastVisible: 0,
        hideServices: function() {
            if (this.isMobile()) {
                this.lastVisible = 3;
            } else {
                this.lastVisible = 6;
            }
            this.serviceList.find('.col-md-4:nth-child(n + ' + (this.lastVisible + 1) + ')').css('display','none');
            if (this.isAllVisible()) {
                $('.service-load-more').css('display','none');
            }
        },
        showServices: function () {
            if (this.isMobile()) {
                this.lastVisible += 3;
            } else {
                this.lastVisible += 6;
            }
            this.serviceList.find('.col-md-4:nth-child(-n + ' + (this.lastVisible) + ')').css('display','block');
            if (this.isAllVisible()) {
                $('.service-load-more').css('display','none');
            }
        },
        isAllVisible: function() {
            return this.lastVisible >= this.serviceList.children().length;
        }
    };

    services.hideServices();
    $('button.service-load-more').click(function() {
        services.showServices();
    });

    $('.photos-container').magnificPopup({
        delegate: 'a.photo-card:not(.slick-cloned)',
        type: 'image',
        tLoading: 'Загрузка изображения #%curr%...',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1], // Will preload 0 - before current, and 1 after the current image
            tCounter: '<span class="mfp-counter">%curr% из %total%</span>'
        }
    });

    $('.review-card img').each(function() {
        var src = $(this).attr('src');
        var imageHref = document.createElement('a');
        var parent = this.parentNode;
        imageHref.setAttribute('href',src);
        imageHref.setAttribute('target', '_blank');
        imageHref.setAttribute('title', $(this).attr('title'));
        imageHref.classList.add('image-popup-zoom', 'image-hidden');
        imageHref.style.display = 'none';
        imageHref.appendChild(this);
        parent.appendChild(imageHref);
        var showHref = document.createElement('a');
        showHref.setAttribute('href','javascript:void(0)');
        showHref.classList.add('image-loader');
        showHref.innerHTML = 'Посмотреть';
        parent.appendChild(showHref);
    });
    $('.image-popup-zoom').magnificPopup({
        type: 'image',
        zoom: {
            enabled: true,
            duration: 300
        }
    });
    $('.image-loader').click(function () {
        var parent = this.parentNode;
        $(parent.getElementsByClassName('image-hidden')).each(function(index, item) {
           item.style.display = 'block';
        });
        this.style.display = 'none';
        var slider = $('.review-cards');
        var currentSlide = slider.slick('slickCurrentSlide');
        slider.slick('slickGoTo', currentSlide);
    });
});
