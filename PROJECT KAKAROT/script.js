/* =========================================
   GLOBAL VARIABLES (The Logic Engine)
   ========================================= */
let currentActiveSection = 'intro'; // Remembers where you are
let isResizing = false; // Safety lock for Full Screen

window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 500);
    }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENTS ---
    const activateBtn = document.getElementById('activate-btn');
    const transformBtn = document.getElementById('transform-btn');
    const scouterBtn = document.getElementById('scouter-menu-btn');
    const feedbackBtn = document.getElementById('feedback-menu-btn');
    
    const introSection = document.getElementById('intro');
    const bioSection = document.getElementById('biography');
    const transformSection = document.getElementById('transformations');
    const scouterSection = document.getElementById('scouter');
    const feedbackSection = document.getElementById('feedback');

    const html = document.documentElement;
    const body = document.body;
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    // --- HELPER: SMOOTH SCROLL ---
    function smoothScrollTo(target) {
        if (!target) return;
        
        // Update tracker immediately
        currentActiveSection = target.id;
        
        html.style.scrollSnapType = 'none';
        body.style.scrollSnapType = 'none';
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
            html.style.scrollSnapType = '';
            body.style.scrollSnapType = '';
            html.style.overflowY = 'auto'; 
        }, 1000);
    }

    // --- HELPER: RE-ALIGN LAYOUT (THE FIX) ---
    function realignLayout() {
        // Snap back to the LAST KNOWN good section
        const target = document.getElementById(currentActiveSection);
        if (target) {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }

    // --- MAIN MENU NAVIGATION ---
    if (activateBtn) activateBtn.addEventListener('click', (e) => { e.preventDefault(); smoothScrollTo(bioSection); });
    if (transformBtn) transformBtn.addEventListener('click', (e) => { e.preventDefault(); smoothScrollTo(transformSection); });
    if (scouterBtn) scouterBtn.addEventListener('click', (e) => { e.preventDefault(); smoothScrollTo(scouterSection); });
    if (feedbackBtn) feedbackBtn.addEventListener('click', (e) => { e.preventDefault(); smoothScrollTo(feedbackSection); });

    // --- RETURN BUTTONS ---
    const backBtns = document.querySelectorAll('#back-btn, #back-btn-2, #back-btn-scouter, #back-btn-feedback');
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault(); smoothScrollTo(introSection); });
    });

    // --- VIDEO SWAPPER & TRACKER (The Brain) ---
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        // SAFETY LOCK: If we are resizing, DO NOT update the tracker
        if (isResizing) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 1. Update the Tracker
                currentActiveSection = entry.target.id;

                // 2. Update Visuals
                document.body.className = ''; 
                if (entry.target.id === 'intro') document.body.classList.add('view-intro');
                if (entry.target.id === 'biography') document.body.classList.add('view-bio');
                if (entry.target.id === 'transformations') document.body.classList.add('view-transform');
                if (entry.target.id === 'scouter') document.body.classList.add('view-scouter');
                if (entry.target.id === 'feedback') document.body.classList.add('view-feedback');
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(section => observer.observe(section));

    // --- FULLSCREEN LOGIC (STABLE) ---
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((e) => console.log(e));
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                fullscreenBtn.innerHTML = "&#x26F6; FULL SCREEN";
            } else {
                fullscreenBtn.innerHTML = "&#x2716; EXIT";
            }
            // Trigger resize logic
            window.dispatchEvent(new Event('resize'));
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            // 1. LOCK the tracker immediately
            isResizing = true;
            
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // 2. Force snap to the correct section
                realignLayout();
                
                // 3. UNLOCK only after we are done
                setTimeout(() => { isResizing = false; }, 100);
            }, 200);
        });
    }

    // --- VIEWER, FORM, & OTHER FEATURES ---
    
    // 1. POWER POLE
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        const pole = document.getElementById('power-pole');
        if (pole) pole.style.width = scrolled + "%";
    });
    
    // 2. INSTANT TRANSMISSION
    const teleportOverlay = document.getElementById('teleport-overlay');
    function triggerTeleport() {
        if (!teleportOverlay) return;
        teleportOverlay.classList.add('teleport-active');
        setTimeout(() => { teleportOverlay.classList.remove('teleport-active'); }, 400);
    }
    const allNavBtns = document.querySelectorAll('.main-menu-btn, #back-btn, #back-btn-2, #back-btn-scouter, #back-btn-feedback');
    allNavBtns.forEach(btn => { btn.addEventListener('click', triggerTeleport); });

    // 3. KI CURSOR
    const cursor = document.getElementById('ki-cursor');
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });
    const clickables = document.querySelectorAll('button, a, .transform-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if(cursor) {
                cursor.style.transform = "translate(-50%, -50%) scale(2)";
                cursor.style.background = "radial-gradient(circle, #fff, #FFD600 40%, transparent 70%)";
                cursor.style.boxShadow = "0 0 30px #FFD600";
            }
        });
        el.addEventListener('mouseleave', () => {
            if(cursor) {
                cursor.style.transform = "translate(-50%, -50%) scale(1)";
                cursor.style.background = "";
                cursor.style.boxShadow = "";
            }
        });
    });

    // 4. VIEWER LOGIC
    const cards = document.querySelectorAll('.transform-card');
    const gridContainer = document.getElementById('grid-container');
    const viewerOverlay = document.getElementById('full-view-overlay');
    const mainBackBtn = document.getElementById('back-btn-2');
    const viewerImg = document.getElementById('viewer-img');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerDesc = document.getElementById('viewer-desc');
    const closeViewerBtn = document.getElementById('close-viewer-btn');
    const barAtk = document.getElementById('bar-atk');
    const barSpd = document.getElementById('bar-spd');
    const barDef = document.getElementById('bar-def');
    let typeWriterInterval;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const imgUrl = card.querySelector('img').src;
            const title = card.getAttribute('data-title');
            const fullDesc = card.getAttribute('data-desc');
            const stats = card.getAttribute('data-stats').split(',');

            viewerImg.src = imgUrl;
            viewerTitle.textContent = title;
            gridContainer.style.display = 'none';
            mainBackBtn.style.display = 'none';
            viewerOverlay.style.display = 'flex';
            viewerImg.classList.remove('slide-in-left');
            void viewerImg.offsetWidth; 
            viewerImg.classList.add('slide-in-left');
            viewerDesc.textContent = ""; 
            clearInterval(typeWriterInterval);
            let i = 0;
            typeWriterInterval = setInterval(() => {
                viewerDesc.textContent += fullDesc.charAt(i);
                i++;
                if (i >= fullDesc.length) clearInterval(typeWriterInterval);
            }, 30);
            barAtk.style.width = "0%"; barSpd.style.width = "0%"; barDef.style.width = "0%";
            setTimeout(() => {
                barAtk.style.width = stats[0] + "%";
                barSpd.style.width = stats[1] + "%";
                barDef.style.width = stats[2] + "%";
            }, 300);
        });
    });

    if (closeViewerBtn) {
        closeViewerBtn.addEventListener('click', () => {
            viewerOverlay.style.display = 'none';
            gridContainer.style.display = 'grid';
            mainBackBtn.style.display = 'inline-block';
            clearInterval(typeWriterInterval);
        });
    }

    // 5. ENERGY FORM & NOTIFICATION
    const energyForm = document.getElementById('energy-form');
    const notification = document.getElementById('db-notification');
    function showDragonBallNotification() {
        if (!notification) return;
        notification.classList.remove('show');
        void notification.offsetWidth;
        notification.classList.add('show');
        setTimeout(() => { notification.classList.remove('show'); }, 3000);
    }

    if (energyForm) {
        energyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = energyForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = "GATHERING...";
            btn.style.backgroundColor = "#00C6FF"; 
            btn.style.color = "#fff";
            btn.style.boxShadow = "0 0 30px #00C6FF";
            btn.style.borderColor = "#fff";
            setTimeout(() => {
                btn.innerHTML = "KAME... HAME... HA!!!";
                btn.style.backgroundColor = "#fff";
                btn.style.color = "#00C6FF";
                btn.style.boxShadow = "0 0 50px #fff, 0 0 100px #00C6FF";
                setTimeout(() => {
                    showDragonBallNotification();
                    btn.innerHTML = "ENERGY SENT! 🙌";
                    btn.style.backgroundColor = "#28a745"; 
                    btn.style.color = "#fff";
                    btn.style.boxShadow = "none";
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = ""; 
                        btn.style.color = "";
                        btn.style.borderColor = "";
                        energyForm.reset();
                    }, 2000);
                }, 1000);
            }, 1500);
        });
    }
});