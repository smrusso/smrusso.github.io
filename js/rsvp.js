import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', function () {
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
    new bootstrap.Modal(rsvpModalElement);
});

const alert_markup = (type, message) => {
    return [
        `<div class="alert alert-${type} alert-dismissible fade show text-start" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
};
