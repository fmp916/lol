
(function ($, window, document) {
    'use strict';

    // Główna funkcja 
    $.fn.scrollUp = function (options) {

        // Upewnij się, że istnieje tylko jeden scrollUp
        if (!$.data(document.body, 'scrollUp')) {
            $.data(document.body, 'scrollUp', true);
            $.fn.scrollUp.init(options);
        }
    };

    // Rozpoczęcie
    $.fn.scrollUp.init = function (options) {

        // Zdefiniuj zmienne
        var o = $.fn.scrollUp.settings = $.extend({}, $.fn.scrollUp.defaults, options),
            triggerVisible = false,
            animIn, animOut, animSpeed, scrollDis, scrollEvent, scrollTarget, $self;

        // Utwórz element
        if (o.scrollTrigger) {
            $self = $(o.scrollTrigger);
        } else {
            $self = $('<a/>', {
                id: o.scrollName,
                href: '#top'
            });
        }

        // Ustaw tytuł przewijania, jeśli istnieje
        if (o.scrollTitle) {
            $self.attr('title', o.scrollTitle);
        }

        $self.appendTo('body');

        // Jeśli nie używasz tekstu wyświetlanego na obrazie
        if (!(o.scrollImg || o.scrollTrigger)) {
            $self.html(o.scrollText);
        }
        //Podstawy
        $self.css({
            display: 'none',
            position: 'fixed',
            zIndex: o.zIndex
        });

        // Nakładka aktywnego punktu
        if (o.activeOverlay) {
            $('<div/>', {
                id: o.scrollName + '-active'
            }).css({
                position: 'absolute',
                'top': o.scrollDistance + 'px',
                width: '100%',
                borderTop: '1px dotted' + o.activeOverlay,
                zIndex: o.zIndex
            }).appendTo('body');
        }

        // Przełączanie typu animacji
        switch (o.animation) {
            case 'fade':
                animIn = 'fadeIn';
                animOut = 'fadeOut';
                animSpeed = o.animationSpeed;
                break;

            case 'slide':
                animIn = 'slideDown';
                animOut = 'slideUp';
                animSpeed = o.animationSpeed;
                break;

            default:
                animIn = 'show';
                animOut = 'hide';
                animSpeed = 0;
        }

        // Jeśli od góry lub od dołu
        if (o.scrollFrom === 'top') {
            scrollDis = o.scrollDistance;
        } else {
            scrollDis = $(document).height() - $(window).height() - o.scrollDistance;
        }

        // Funkcja przewijania
        scrollEvent = $(window).scroll(function () {
            if ($(window).scrollTop() > scrollDis) {
                if (!triggerVisible) {
                    $self[animIn](animSpeed);
                    triggerVisible = true;
                }
            } else {
                if (triggerVisible) {
                    $self[animOut](animSpeed);
                    triggerVisible = false;
                }
            }
        });

        if (o.scrollTarget) {
            if (typeof o.scrollTarget === 'number') {
                scrollTarget = o.scrollTarget;
            } else if (typeof o.scrollTarget === 'string') {
                scrollTarget = Math.floor($(o.scrollTarget).offset().top);
            }
        } else {
            scrollTarget = 0;
        }

        // Do góry
        $self.click(function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: scrollTarget
            }, o.scrollSpeed, o.easingType);
        });
    };

    // Ustawienia domyślne
    $.fn.scrollUp.defaults = {
        scrollName: 'scrollUp',      // Element ID
        scrollDistance: 700,         // Odległość od góry/dołu przed wyświetleniem elementu (px)
        scrollFrom: 'top',           // „góra” lub ”dół
        scrollSpeed: 400,            // Prędkość powrotu do góry (ms)
        easingType: 'linear',        // Przewiń do góry
        animation: 'fade',           // Zanikanie, przesuwanie, brak
        animationSpeed: 400,         // Szybkość animacji (ms)
        scrollTrigger: false,        // Ustawienie niestandardowego element wyzwalający
        scrollTarget: false,         // Ustawia niestandardowy element docelowy przewijania
        scrollText: 'Scroll to top', // Tekst dla elementu
        scrollTitle: false,          // W razie potrzeby ustawia niestandardowy tytuł
        scrollImg: false,            // Ustaw wartość true, aby używać obrazu
        activeOverlay: false,        // Ustaw kolor CSS do wyświetlania aktywnego punktu scrollUp
        zIndex: 2147483647           // Z-Index dla nakładki
    };

    // Zniszczenie wtyczki scrollUp i wyczyszczenie wszystkich modyfikacji DOM.
    $.fn.scrollUp.destroy = function (scrollEvent) {
        $.removeData(document.body, 'scrollUp');
        $('#' + $.fn.scrollUp.settings.scrollName).remove();
        $('#' + $.fn.scrollUp.settings.scrollName + '-active').remove();

        //W wersji 1.7 lub nowszej należy użyć nowej funkcji .off()
        if ($.fn.jquery.split('.')[1] >= 7) {
            $(window).off('scroll', scrollEvent);

        // W przeciwnym razie użyj starego .unbind()
        } else {
            $(window).unbind('scroll', scrollEvent);
        }
    };

    $.scrollUp = $.fn.scrollUp;

})(jQuery, window, document);
