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
        messageH4.style.textAlign = 'center';
        messageH4.style.textTransform = 'none';
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
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.textTransform = 'none';
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
        ibanH4.style.textAlign = 'center';
        ibanH4.style.textTransform = 'none';
        ibanH4.innerHTML = 'IBAN: ';
        ibanH4.appendChild(ibanEl);

        const ownerH4 = document.createElement('h4');
        ownerH4.style.textAlign = 'center';
        ownerH4.style.textTransform = 'none';
        ownerH4.innerHTML = 'Intestato a: ';
        ownerH4.appendChild(ibanOwnerEl);

        ibanContainer.appendChild(ibanH4);
        ibanContainer.appendChild(ownerH4);

        ibanDetailsContainer.appendChild(ibanContainer);
    };
    
    const allergiesInput = document.querySelector('input[name="allergies"]');
    const allergiesRow = allergiesInput.closest('.row');
    const destinationInput = document.querySelector('select[name="destination"]');
    const destinationRow = destinationInput.closest('.row');
    const destinationOtherInput = document.querySelector('input[name="destinationOther"]');
    const destinationOtherRow = destinationOtherInput.closest('.row');
    const notesInput = document.querySelector('input[name="notes"]');
    const notesRow = notesInput.closest('.row');
    const responseInput = document.querySelector('select[name="response"]');

    const handleRsvpFields = () => {
        if (responseInput.value) {
            responseInput.classList.add('has-value');
        }
        if (responseInput.value === 'Sì') {
            allergiesRow.classList.remove('hidden-by-default');
            destinationRow.classList.remove('hidden-by-default');
            notesRow.classList.remove('hidden-by-default');
            if (destinationInput.value) {
                destinationInput.classList.add('has-value');
            }
            if (destinationInput.value === "Altro") {
                destinationOtherRow.classList.remove('hidden-by-default');
            }
        } else {
            allergiesInput.value = '';
            allergiesRow.classList.add('hidden-by-default');
            destinationInput.value = '';
            destinationInput.classList.remove('has-value');
            destinationRow.classList.add('hidden-by-default');
            destinationInput.value = '';
            destinationOtherInput.value = '';
            destinationOtherRow.classList.add('hidden-by-default');
            notesInput.value = '';
            notesRow.classList.add('hidden-by-default');
        }
    }

    responseInput.addEventListener('change', (event) => {
        event.target.classList.add('has-value');
        handleRsvpFields();
    });

    destinationRow.addEventListener('change', (event) => {
        event.target.classList.add('has-value');
        if (event.target.value === 'Altro') {
            destinationOtherRow.classList.remove('hidden-by-default');
        } else {
            destinationOtherInput.value = '';
            destinationOtherRow.classList.add('hidden-by-default');
        }
    });

    handleIbanVisibility();
    handleRsvpFields();


    /********************** RSVP **********************/
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
                const rsvpModal = document.getElementById('rsvp-modal');
                rsvpModal.classList.add('in');
                rsvpModal.style.display = 'block';
                document.body.classList.add('modal-open');
                rsvpForm.reset();
                handleRsvpFields();
            }
        } catch (error) {
            console.error('Error:', error);
            alertWrapper.innerHTML = alert_markup('danger', '<strong>Oh no 😞</strong> Abbiamo avuto un problema, per favorire riprova più tardi.');
        }
    });

    const rsvpModal = document.getElementById('rsvp-modal');
    const closeButton = rsvpModal.querySelector('.close');

    function hideModal() {
        rsvpModal.classList.remove('in');
        rsvpModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    closeButton.addEventListener('click', hideModal);
    rsvpModal.addEventListener('click', function(e) {
        if (e.target === rsvpModal) {
            hideModal();
        }
    });

});

/********************** Extras **********************/
}

// alert_markup
function alert_markup(alert_type, msg) {
    return '<div class="alert alert-' + alert_type + '" role="alert">' + msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span>&times;</span></button></div>';
}
