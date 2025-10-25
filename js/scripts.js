$(document).ready(function () {

    /***************** Waypoints ******************/

    $('.wp1').waypoint(function () {
        $('.wp1').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp2').waypoint(function () {
        $('.wp2').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp3').waypoint(function () {
        $('.wp3').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp4').waypoint(function () {
        $('.wp4').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp5').waypoint(function () {
        $('.wp5').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp6').waypoint(function () {
        $('.wp6').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp7').waypoint(function () {
        $('.wp7').addClass('animated fadeInUp');
    }, {
        offset: '75%'
    });
    $('.wp8').waypoint(function () {
        $('.wp8').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp9').waypoint(function () {
        $('.wp9').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });

    /***************** Initiate Flexslider ******************/
    $('.flexslider').flexslider({
        animation: "slide"
    });

    /***************** Nav Transformicon ******************/

    /* When user clicks the Icon */
    $('.nav-toggle').click(function () {
        $(this).toggleClass('active');
        $('.header-nav').toggleClass('open');
        event.preventDefault();
    });
    /* When user clicks a link */
    $('.header-nav li a').click(function () {
        $('.nav-toggle').toggleClass('active');
        $('.header-nav').toggleClass('open');

    });

    /***************** Header BG Scroll ******************/

    $(function () {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();

            if (scroll >= 20) {
                $('section.navigation').addClass('fixed');
                $('header').css({
                    "border-bottom": "none",
                    "padding": "35px 0"
                });
                $('header .member-actions').css({
                    "top": "26px",
                });
                $('header .navicon').css({
                    "top": "34px",
                });
            } else {
                $('section.navigation').removeClass('fixed');
                $('header').css({
                    "border-bottom": "solid 1px rgba(255, 255, 255, 0.2)",
                    "padding": "50px 0"
                });
                $('header .member-actions').css({
                    "top": "41px",
                });
                $('header .navicon').css({
                    "top": "48px",
                });
            }
        });
    });
    /***************** Smooth Scrolling ******************/

    $(function () {

        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 90
                    }, 2000);
                    return false;
                }
            }
        });

    });

import './youtube';

            '<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(window.location) + '&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=101094500229731&amp;width=150" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:150px; height:21px;" allowTransparency="true"></iframe>' +

            '<div class="g-plusone" data-size="medium"></div>';

        // '<iframe src="https://plusone.google.com/_/+1/fastbutton?bsv&amp;size=medium&amp;url=' + encodeURIComponent(window.location) + '" allowtransparency="true" frameborder="0" scrolling="no" title="+1" style="width:105px; height:21px;"></iframe>';

        share_bar[i].innerHTML = html;
        share_bar[i].style.display = 'inline-block';
    }

    /********************** Embed youtube video *********************/
    $('.player').YTPlayer();


    /********************** Toggle Map Content **********************/
    $('#btn-show-map').click(function () {
        $('#map-content').toggleClass('toggle-map-content');
        $('#btn-show-content').toggleClass('toggle-map-content');
    });
    $('#btn-show-content').click(function () {
        $('#map-content').toggleClass('toggle-map-content');
        $('#btn-show-content').toggleClass('toggle-map-content');
    });

    /*********************** IBAN visibility ************************/
    let scriptId = null;
    const worker = new Worker('js/decrypt.js');

    const displayQrCodeMessage = (container) => {
        const messageH4 = document.createElement('h4');
        messageH4.textContent = 'Scansiona il codice QR per vedere i dettagli';
        container.innerHTML = '';
        container.appendChild(messageH4);
    };

    const handleIbanVisibility = async () => {
        const secret = new URLSearchParams(window.location.search).get('secret');
        const ibanDetailsContainer = document.getElementById('iban-details');

        const checkCiphertext = document.getElementById('check-ciphertext').textContent;
        const checkIv = document.getElementById('check-iv').textContent;
        const ibanCiphertext = document.getElementById('iban-ciphertext').textContent;
        const ibanIv = document.getElementById('iban-iv').textContent;
        const scriptIdCiphertext = document.getElementById('script-id-ciphertext').textContent;
        const scriptIdIv = document.getElementById('script-id-iv').textContent;
        
        if (!secret || scriptIdCiphertext === 'CIPHERTEXT_HERE' || scriptIdIv === 'IV_HERE' || ibanCiphertext === 'CIPHERTEXT_HERE' || ibanIv === 'IV_HERE' || checkCiphertext === 'CIPHERTEXT_HERE' || checkIv === 'IV_HERE') {
            displayQrCodeMessage(ibanDetailsContainer);
            return;
        }

        const loadingIndicator = document.createElement('h4');
        loadingIndicator.textContent = 'Decifrando i dati...';
        ibanDetailsContainer.appendChild(loadingIndicator);

        worker.postMessage({
            secret,
            scriptIdCiphertext,
            scriptIdIv,
            ibanCiphertext,
            ibanIv,
            checkCiphertext,
            checkIv
        });
    }

    worker.onmessage = (event) => {
        const ibanDetailsContainer = document.getElementById('iban-details');
        ibanDetailsContainer.innerHTML = '';

        if (event.data.error) {
            displayQrCodeMessage(ibanDetailsContainer);
            return;
        }

        const { scriptId: decryptedScriptId, iban: decryptedIban } = event.data;
        scriptId = decryptedScriptId;
        document.getElementById('script-id').textContent = decryptedScriptId;

        const ibanContainer = document.createElement('div');
        const ibanEl = document.createElement('span');
        const ibanOwnerEl = document.createElement('span');

        ibanEl.textContent = decryptedIban.iban;
        ibanOwnerEl.textContent = decryptedIban.owner;

        const ibanH4 = document.createElement('h4');
        ibanH4.innerHTML = 'IBAN: ';
        ibanH4.appendChild(ibanEl);

        const ownerH4 = document.createElement('h4');
        ownerH4.innerHTML = 'Intestato a: ';
        ownerH4.appendChild(ibanOwnerEl);

        ibanContainer.appendChild(ibanH4);
        ibanContainer.appendChild(ownerH4);

        ibanDetailsContainer.appendChild(ibanContainer);
    };

    handleIbanVisibility();

    /********************** RSVP **********************/
    const allergiesInput = document.querySelector('input[name="allergies"]');
    const allergiesInputGroup = allergiesInput.closest('.form-input-group');
    const destinationInput = document.querySelector('select[name="destination"]');
    const destinationInputGroup = destinationInput.closest('.form-input-group');
    const destinationOtherInput = document.querySelector('input[name="destinationOther"]');
    const destinationOtherInputGroup = destinationOtherInput.closest('.form-input-group');
    const notesInput = document.querySelector('input[name="notes"]');
    const notesInputGroup = notesInput.closest('.form-input-group');
    const responseInput = document.querySelector('select[name="response"]');

    const handleRsvpFields = () => {
        if (responseInput.value) {
            responseInput.classList.add('has-value');
        }

        const isComing = responseInput.value === 'Sì';

        allergiesInputGroup.classList.toggle('d-none', !isComing);
        destinationInputGroup.classList.toggle('d-none', !isComing);
        notesInputGroup.classList.toggle('d-none', !isComing);

        if (isComing) {
            if (destinationInput.value) {
                destinationInput.classList.add('has-value');
            }
            const isDestinationOther = destinationInput.value === 'Altro';
            destinationOtherInputGroup.classList.toggle('d-none', !isDestinationOther);
            if (!isDestinationOther) {
                destinationOtherInput.value = '';
            }
        } else {
            // Clear all fields if not coming
            allergiesInput.value = '';
            destinationInput.value = '';
            destinationInput.classList.remove('has-value');
            destinationOtherInput.value = '';
            notesInput.value = '';
            destinationOtherInputGroup.classList.add('d-none');
        }
    };

    responseInput.addEventListener('change', (event) => {
        event.target.classList.add('has-value');
        handleRsvpFields();
    });

    destinationInputGroup.addEventListener('change', (event) => {
        event.target.classList.add('has-value');
        handleRsvpFields();
    });

    handleRsvpFields();

    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(rsvpForm);
        const alertWrapper = document.getElementById('alert-wrapper');
        alertWrapper.innerHTML = alert_markup('info', '<strong>Solo un minuto 🕜</strong> Stiamo salvando la tua risposta.');
        
        const scriptId = document.getElementById('script-id').textContent;
        if (!scriptId) {
            alertWrapper.innerHTML = alert_markup('danger', '<strong>Oh no 😞</strong> Usa il codice QR per inviare la risposta.');
            return;
        }

        const url = new URL(`https://script.google.com/macros/s/${scriptId}/exec`);
        url.search = new URLSearchParams(formData).toString();

        try {
            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow'
            });
            const data = await response.json();

            if (data.result === "error") {
                alertWrapper.innerHTML = alert_markup('danger', data.message);
            } else {
                alertWrapper.innerHTML = '';
                const rsvpModal = new bootstrap.Modal(document.getElementById('rsvp-modal'));
                rsvpModal.show();
                rsvpForm.reset();
                handleRsvpFields();
            }
        } catch (error) {
            console.error('Error:', error);
            alertWrapper.innerHTML = alert_markup('danger', '<strong>Oh no 😞</strong> Abbiamo avuto un problema, per favorire riprova più tardi.');
        }
    });

    const rsvpModalElement = document.getElementById('rsvp-modal');
    const rsvpModal = new bootstrap.Modal(rsvpModalElement);
});

/********************** Extras **********************/
const alert_markup = (type, message) => {
    return [
        `<div class="alert alert-${type} alert-dismissible fade show text-start" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
}