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

    $('input[name="phone"]').inputmask("+9 (999) 999 99 99");

    $('.callbackForm').submit(function(e) {
        e.preventDefault();
        var nameElement = this.elements.name;
        var phoneElement = this.elements.phone;
        var name = nameElement.value.trim();
        var phone = phoneElement.value.trim();
        var valid = true;
        if (name === '') {
            nameElement.classList.add('no-valid');
            valid = false;
        } else {
            nameElement.classList.remove('no-valid');
        }
        if (phone.indexOf('_') !== -1) {
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
        $('.ajax-status').html('Отправляем <span class="icon-spinner spin-me" style="display: inline-block;"></span>');
        $(form).attr('disabled', true);
        $(form.elements).attr('disabled', true);
        $.get(src, function() {
            console.log('send');
            $('.ajax-status').html('Отправлено <span class="icon-checkmark" style="display: inline-block;"></span>');
        });
    };

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
        delegate: 'a.photo-card',
        type: 'image',
        tLoading: 'Загрузка изображения #%curr%...',
        gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        }
    });

    $('.review-card img').each(function() {
        var src = $(this).attr('src');
        var imageHref = document.createElement('a');
        var parent = this.parentNode;
        imageHref.setAttribute('href',src);
        imageHref.setAttribute('target', '_blank');
        imageHref.setAttribute('title','Фото');
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
    });
});
