function continuar() {
    // Animação de transição
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        alert('Redirecionando para a próxima página...');
        // Aqui você pode adicionar o redirecionamento real
        // window.location.href = 'proxima-pagina.html';
        document.body.style.opacity = '1';
    }, 500);
}

// Adicionar efeito de paralaxe sutil ao mover o mouse
document.addEventListener('mousemove', (e) => {
    const mascot = document.querySelector('.mascot');
    const x = (e.clientX / window.innerWidth) * 20 - 10;
    const y = (e.clientY / window.innerHeight) * 20 - 10;
    
    mascot.style.transform = `translateX(${x}px) translateY(${y}px)`;
});