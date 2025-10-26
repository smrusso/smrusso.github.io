import * as bootstrap from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvp-form');
    const responseInput = document.getElementById('rsvp-form-response');
    const alertWrapper = document.getElementById('alert-wrapper');
    const rsvpModalElement = document.getElementById('rsvp-modal');

    const fields = {
        allergies: document.getElementById('rsvp-form-allergies'),
        destination: document.getElementById('rsvp-form-destination'),
        destinationOther: document.getElementById('rsvp-form-destination-other'),
        notes: document.getElementById('rsvp-form-notes'),
    };

    const groups = Object.fromEntries(
        Object.entries(fields).map(([key, el]) => [key, el.closest('.form-input-group')])
    );

    const showAlert = (type, message) => {
        alertWrapper.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show text-start" role="alert">
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    };

    const handleRsvpFields = () => {
        const isComing = responseInput.value === 'Sì';
        responseInput.classList.toggle('has-value', !!responseInput.value);

        // Toggle field visibility
        ['allergies', 'destination', 'notes'].forEach(key =>
            groups[key].classList.toggle('d-none', !isComing)
        );

        const isDestinationOther = isComing && fields.destination.value === 'Altro';
        groups.destinationOther.classList.toggle('d-none', !isDestinationOther);

        if (isComing) {
            fields.destination.classList.toggle('has-value', !!fields.destination.value);
            if (!isDestinationOther) fields.destinationOther.value = '';
        } else {
            // Reset all fields
            Object.values(fields).forEach(f => {
                f.value = '';
                f.classList.remove('has-value');
            });
            groups.destinationOther.classList.add('d-none');
        }
    };

    document.querySelectorAll('.rsvp-form .form-input-group select').forEach(select => {
        const wrapper = select.closest('.form-input-group');
        let isOpen = false;

        // When the select loses focus, ensure we close it
        select.addEventListener('blur', () => {
            wrapper.classList.remove('select-open');
            isOpen = false;
        });

        select.addEventListener('click', () => {
            // Let the browser process the open/close state first
            setTimeout(() => {
                // If the select just got focus but wasn't open before, mark as open
                if (!isOpen) {
                    wrapper.classList.add('select-open');
                    isOpen = true;
                }
                // If it was already open, the user just closed it
                else {
                    wrapper.classList.remove('select-open');
                    isOpen = false;
                }
            }, 0);
        });
    });

    rsvpForm.addEventListener('change', (e) => {
        if (e.target.matches('select, input, textarea')) {
            e.target.classList.add('has-value');
            handleRsvpFields();
        }
    });

    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const scriptId = document.getElementById('script-id')?.textContent?.trim();
        if (!scriptId) {
            showAlert('danger', '<strong>Oh no 😞</strong> Usa il codice QR per inviare la risposta.');
            return;
        }

        showAlert('info', '<strong>Solo un minuto 🕜</strong> Stiamo salvando la tua risposta.');
        const formData = new FormData(rsvpForm);
        const url = new URL(`https://script.google.com/macros/s/${scriptId}/exec`);
        url.search = new URLSearchParams(formData).toString();

        try {
            const response = await fetch(url, { method: 'GET', redirect: 'follow' });
            const data = await response.json();

            if (data.result === 'error') {
                showAlert('danger', data.message);
            } else {
                alertWrapper.innerHTML = '';
                new bootstrap.Modal(rsvpModalElement).show();
                rsvpForm.reset();
                handleRsvpFields();
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('danger', '<strong>Oh no 😞</strong> Abbiamo avuto un problema, per favore riprova più tardi.');
        }
    });

    handleRsvpFields();
    new bootstrap.Modal(rsvpModalElement); // Pre-initialize modal
});
