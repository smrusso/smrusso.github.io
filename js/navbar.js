document.addEventListener('DOMContentLoaded', function () {
    /***************** Smooth Scrolling ******************/
    /**
     * Smooth scroll to a Y position with ease-in-out
     * @param {number} targetY - Y-coordinate to scroll to
     * @param {number} duration - Duration in ms
     */
    function smoothScrollTo(targetY, duration = 600) {
        const startY = window.scrollY || window.pageYOffset;
        const startTime = performance.now();

        function scrollStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-in-out cubic
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(0, startY + (targetY - startY) * ease);

            if (progress < 1) {
                requestAnimationFrame(scrollStep);
            }
        }
        requestAnimationFrame(scrollStep);
    }

    // Navbar smooth scroll handler
    document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(link => {
        link.addEventListener('click', function (event) {
            // Only handle links on the same page
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '')
                && location.hostname === this.hostname) {

                let target = document.querySelector(this.hash);
                target = target ? target : document.querySelector('[name=' + this.hash.slice(1) + ']');

                if (target) {
                    event.preventDefault();

                    const navbarHeight = document.querySelector('nav').offsetHeight;
                    const targetPadding = parseFloat(window.getComputedStyle(target).paddingTop) || 0;
                    const scrollToY = target.offsetTop - navbarHeight + targetPadding - 16;

                    smoothScrollTo(scrollToY, 600); // 600ms duration
                }
            }
        });
    });
});
