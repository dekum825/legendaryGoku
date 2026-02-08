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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.classList.add('scrolled-mode');
            } else {
                document.body.classList.remove('scrolled-mode');
            }
        });
    }, { threshold: 0.5 });

    if (bioSection) observer.observe(bioSection);
});