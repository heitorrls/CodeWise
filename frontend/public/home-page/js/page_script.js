            // Parallax effect on scroll
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const imgMain = document.getElementById('img-main');
                if (imgMain) {
                    imgMain.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
            });

            // Intersection Observer for scroll animations
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.sobre-image, .visao-image, .missao-image').forEach(el => {
                observer.observe(el);
            });

            // Button click animation
            const btnComecar = document.getElementById('btn-comecar');
            if (btnComecar) {
                btnComecar.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-3px) scale(1)';
                        window.location.href = 'apresentacao.html';
                    }, 150);
                });
            }