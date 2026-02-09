document.addEventListener('DOMContentLoaded', () => {
    const activateBtn = document.getElementById('activate-btn');
    const backBtn = document.getElementById('back-btn'); // Select the new button
    const bioSection = document.getElementById('biography');
    const introSection = document.getElementById('intro'); // Select the top section
    const html = document.documentElement;
    const body = document.body;


    if (activateBtn && bioSection) {
        activateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            

            activateBtn.classList.add('launching-btn');


            html.style.scrollSnapType = 'none';
            body.style.scrollSnapType = 'none';
            bioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });


            setTimeout(() => {
                const gallery = document.querySelector('.gallery-wrapper');
                if (gallery) gallery.classList.add('gallery-active');
            }, 300);


            setTimeout(() => {
                html.style.scrollSnapType = '';
                body.style.scrollSnapType = '';
            }, 1000); 
        });
    }


    if (backBtn && introSection) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            

            setTimeout(() => {
                activateBtn.classList.remove('launching-btn');
            }, 800);


            const gallery = document.querySelector('.gallery-wrapper');
            if (gallery) gallery.classList.remove('gallery-active');


            html.style.scrollSnapType = 'none';
            body.style.scrollSnapType = 'none';
            introSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            setTimeout(() => {
                html.style.scrollSnapType = '';
                body.style.scrollSnapType = '';
            }, 1000);
        });
    }

    // ... existing button code ...

    /* =========================================
       NEW BUTTON LOGIC: TRANSFORM BUTTON
       ========================================= */
    const transformBtn = document.getElementById('transform-btn');
    const transformSection = document.getElementById('transformations');
    const backBtn2 = document.getElementById('back-btn-2');

    if (transformBtn && transformSection) {
        transformBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Lock screen during animation
            html.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
            
            // Scroll to Transformations
            html.style.scrollSnapType = 'none';
            body.style.scrollSnapType = 'none';
            transformSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            setTimeout(() => {
                html.style.scrollSnapType = '';
                body.style.scrollSnapType = '';
                html.style.overflowY = 'auto'; // Unlock vertical
                body.style.overflowX = 'hidden'; // Keep horizontal locked
            }, 1000);
        });
    }

    // Back Button inside Transformations Section
    if (backBtn2 && introSection) {
        backBtn2.addEventListener('click', (e) => {
            e.preventDefault();
            introSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* =========================================
       SMART VIDEO SWAPPER (3-WAY)
       ========================================= */
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove all view classes first
                document.body.classList.remove('view-intro', 'view-bio', 'view-transform');
                
                // Add the class for the current section
                if (entry.target.id === 'intro') {
                    document.body.classList.add('view-intro');
                } else if (entry.target.id === 'biography') {
                    document.body.classList.add('view-bio');
                } else if (entry.target.id === 'transformations') {
                    document.body.classList.add('view-transform');
                }
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    sections.forEach(section => {
        observer.observe(section);
    });
});
/* =========================================
       NEW LOGIC: INTERACTIVE GRID VIEWER
       ========================================= */
    const cards = document.querySelectorAll('.transform-card');
    const gridContainer = document.getElementById('grid-container');
    const viewerOverlay = document.getElementById('full-view-overlay');
    const mainBackBtn = document.getElementById('back-btn-2'); // The button that goes to Intro
    
    // Viewer Elements
    const viewerImg = document.getElementById('viewer-img');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerDesc = document.getElementById('viewer-desc');
    const closeViewerBtn = document.getElementById('close-viewer-btn');

    /* =========================================
       UPDATED: OPEN VIEWER WITH ANIMATION RESET
       ========================================= */
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Get Data
            const imgUrl = card.querySelector('img').src;
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            // 2. Populate Viewer
            viewerImg.src = imgUrl;
            viewerTitle.textContent = title;
            viewerDesc.textContent = desc;

            // 3. RESET ANIMATIONS (Magic Trick)
            // We remove the classes first...
            viewerImg.classList.remove('slide-in-left');
            document.querySelector('.viewer-text').classList.remove('slide-in-right');
            
            // ...Trigger a "Reflow" (tells browser to forget the previous state)...
            void viewerImg.offsetWidth; 
            
            // ...Then add them back to start animation from 0!
            viewerImg.classList.add('slide-in-left');
            document.querySelector('.viewer-text').classList.add('slide-in-right');

            // 4. Show Overlay
            gridContainer.style.display = 'none';
            mainBackBtn.style.display = 'none';
            viewerOverlay.style.display = 'flex';
        });
    });

    // 2. CLOSE VIEWER (Back Button)
    if (closeViewerBtn) {
        closeViewerBtn.addEventListener('click', () => {
            viewerOverlay.style.display = 'none'; // Hide Viewer
            
            gridContainer.style.display = 'block'; // Show Grid
            mainBackBtn.style.display = 'inline-block'; // Show "Return to Start"
        });
    }
    /* =========================================
       FULL SCREEN TOGGLE LOGIC
       ========================================= */
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                // ENTER FULL SCREEN
                document.documentElement.requestFullscreen().catch((err) => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
                fullscreenBtn.innerHTML = "&#x2716; EXIT";
            } else {
                // EXIT FULL SCREEN
                document.exitFullscreen();
                fullscreenBtn.innerHTML = "&#x26F6; FULL SCREEN";
            }
        });
    }

    // Listen for Escape key (to update button text if user presses Esc)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.innerHTML = "&#x26F6; FULL SCREEN";
        }
    });