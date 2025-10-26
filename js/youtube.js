document.addEventListener('DOMContentLoaded', function () {
    window.onYouTubeIframeAPIReady =  function () {
        const player = new YT.Player('rome-video-player', {
            videoId: '0m7H6_ZI1iM', // 🔹 Replace with your YouTube video ID
            playerVars: {
                autoplay: 1,
                cc_load_policy: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                loop: 1,
                playlist: '0m7H6_ZI1iM',
                playsinline: 1,
                rel: 0,
                start: 1509
            },
            events: {
                onReady: onPlayerReady
            }
        });
    }

    function onPlayerReady(event) {
        // ensure playback starts
        event.target.mute();

        resizeYouTubeCover();
        window.addEventListener('resize', resizeYouTubeCover);
    }

    function resizeYouTubeCover() {
        const wrapper = document.getElementById('rome-video-content');
        const iframe = wrapper.querySelector('iframe');
        if (!iframe) return; // wait until iframe exists

        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;
        const wrapperRatio = wrapperWidth / wrapperHeight;
        const videoRatio = 16 / 9;

        let width, height;

        // Cover logic (like background-size: cover)
        if (wrapperRatio > videoRatio) {
            width = wrapperWidth;
            height = width / videoRatio;
        } else {
            height = wrapperHeight;
            width = height * videoRatio;
        }

        iframe.style.width = `${width}px`;
        iframe.style.height = `${height}px`;
        iframe.style.transform = `translate(-50%, -50%)`;
    }
});
