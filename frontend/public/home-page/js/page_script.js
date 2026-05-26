            // Parallax effect on scroll
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const imgMain = document.getElementById('img-main');
                if (imgMain) {
                    imgMain.style.transform = `translateY(${scrolled * 0.1}px)`;
                }
            });

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


            document.querySelectorAll('button[data-url]').forEach((button) => {
                button.addEventListener('click', function() {
                    const url = this.dataset.url;

                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-3px) scale(1)';
                        window.location.href = url;
                    }, 150);
                });
            });
