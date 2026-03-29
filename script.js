// Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if(burger && nav) {
    burger.addEventListener('click', () => {
      const isFlex = nav.style.display === 'flex';
      nav.style.display = isFlex ? 'none' : 'flex';
    });
}

// Intersection reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { 
      if (e.isIntersecting) e.target.classList.add('visible'); 
  });
},{threshold: .1});

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

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
  modal.addEventListener('click', (e) => { 
      if (!dialog.contains(e.target)) modal.classList.remove('show'); 
  });
  
  const closeBtn = modal.querySelector('.close');
  if(closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  }
});
// --- SYSTÈME DE NAVIGATION (FLUIDE + CROIX RÉPARÉE) ---
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card.project.open-modal'));

  document.querySelectorAll('.modal').forEach((modal) => {
      // 1. Création des flèches
      if (!modal.querySelector('.modal-arrow')) {
          const prevBtn = document.createElement('button');
          prevBtn.innerHTML = '&#10094;';
          prevBtn.className = 'modal-arrow prev';
          
          const nextBtn = document.createElement('button');
          nextBtn.innerHTML = '&#10095;';
          nextBtn.className = 'modal-arrow next';
          
          // Écoute des clics sur les flèches
          prevBtn.addEventListener('click', function(event) {
              event.preventDefault(); event.stopPropagation();
              changerProjetFluide(modal, -1);
          });

          nextBtn.addEventListener('click', function(event) {
              event.preventDefault(); event.stopPropagation();
              changerProjetFluide(modal, 1);
          });

          modal.appendChild(prevBtn);
          modal.appendChild(nextBtn);
      }

      // 2. LA CORRECTION EST ICI : Réparer la croix et le clic sur le fond
      const closeBtn = modal.querySelector('.close');
      if (closeBtn) {
          closeBtn.addEventListener('click', () => fermerModalProprement(modal));
      }
      
      // Sécurité bonus : permet de fermer en cliquant sur le fond noir autour du projet
      modal.addEventListener('click', (e) => {
          if (e.target === modal) {
              fermerModalProprement(modal);
          }
      });
  });

  // Fonction pour bien tout nettoyer quand on ferme
  function fermerModalProprement(modal) {
      modal.style.display = 'none'; // Force la fermeture
      
      // On remet la boîte de texte droite pour la prochaine fois qu'on l'ouvrira
      const dialog = modal.querySelector('.modal-dialog');
      if (dialog) {
          dialog.style.transition = 'none';
          dialog.style.opacity = '1';
          dialog.style.transform = 'none';
      }
  }

  // 3. La fonction magique qui gère la fluidité
  function changerProjetFluide(currentModal, direction) {
      const currentModalId = currentModal.id;
      
      let currentIndex = cards.findIndex(card => card.getAttribute('data-modal') === currentModalId);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex + direction;
      if (nextIndex >= cards.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = cards.length - 1;

      const nextModalId = cards[nextIndex].getAttribute('data-modal');
      const nextModal = document.getElementById(nextModalId);
      if (!nextModal) return;

      const currentDialog = currentModal.querySelector('.modal-dialog');
      const nextDialog = nextModal.querySelector('.modal-dialog');

      // --- ÉTAPE 1 : FAIRE SORTIR L'ACTUEL ---
      currentDialog.style.transition = 'all 0.3s ease';
      currentDialog.style.opacity = '0';
      currentDialog.style.transform = direction === 1 ? 'translateX(-50px)' : 'translateX(50px)';

      // --- ÉTAPE 2 : ATTENDRE (300ms) ET CHANGER LE FOND ---
      setTimeout(() => {
          
          currentModal.style.display = 'none'; // Cache l'ancien
          nextModal.style.display = 'flex';    // Affiche le nouveau (ou 'block' selon votre design)

          // --- ÉTAPE 3 : PRÉPARER LE NOUVEAU POUR QU'IL ARRIVE ---
          nextDialog.style.transition = 'none';
          nextDialog.style.opacity = '0';
          nextDialog.style.transform = direction === 1 ? 'translateX(50px)' : 'translateX(-50px)';

          // --- ÉTAPE 4 : FAIRE ENTRER LE NOUVEAU ---
          setTimeout(() => {
              nextDialog.style.transition = 'all 0.3s ease';
              nextDialog.style.opacity = '1';
              nextDialog.style.transform = 'translateX(0)'; // Retour au centre
              
              // Nettoyer l'ancien pour la prochaine fois en arrière-plan
              setTimeout(() => {
                  currentDialog.style.transition = 'none';
                  currentDialog.style.opacity = '1';
                  currentDialog.style.transform = 'none';
              }, 300);

          }, 30);

      }, 300);
  }
});
// --- SYSTÈME POUR AGRANDIR LES IMAGES (LIGHTBOX) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Créer le fond noir dynamiquement
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-image';
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    // 2. Fermer quand on clique sur le fond noir
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // 3. Activer le clic sur les images
    // Le setTimeout permet d'attendre que tout le HTML soit bien chargé
    setTimeout(() => {
        const imagesToZoom = document.querySelectorAll('.clickable-image');
        imagesToZoom.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); // Empêche de fermer la fenêtre du projet
                lightboxImg.src = img.src; // Copie la source de l'image
                lightbox.classList.add('active'); // Affiche en grand
            });
        });
    }, 500);
});