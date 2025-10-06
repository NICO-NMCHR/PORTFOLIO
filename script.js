// Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger?.addEventListener('click', () => {
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

// Intersection reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
},{threshold: .15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Year
document.getElementById('year')?.textContent = new Date().getFullYear();

// Modals
document.querySelectorAll('.open-modal').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.modal;
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
  });
});
document.querySelectorAll('.modal').forEach(modal => {
  const dialog = modal.querySelector('.modal-dialog');
  modal.addEventListener('click', (e) => { if (!dialog.contains(e.target)) modal.classList.remove('show'); });
  modal.querySelector('.close')?.addEventListener('click', () => modal.classList.remove('show'));
});
