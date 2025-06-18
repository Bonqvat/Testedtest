function initTermsPrivacyPage() {
    function openTab(tabName) {
        const tabContents = document.getElementsByClassName('terms-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        
        const tabs = document.getElementsByClassName('tab');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }
        
        document.getElementById(tabName).classList.add('active');
        
        if (window.event) {
            window.event.currentTarget.classList.add('active');
        } else {
            const tabIndex = tabName === 'terms' ? 0 : 1;
            if (tabs[tabIndex]) tabs[tabIndex].classList.add('active');
        }
    }
    
    function updateHeaderCounters() {
        const state = JSON.parse(localStorage.getItem('futureAutoState')) || { cart: [], favorites: [] };
        const cartIcon = document.getElementById('cart-icon');
        const favIcon = document.getElementById('favorites-icon');
        
        if (cartIcon) {
            if (state.cart.length > 0) {
                cartIcon.setAttribute('data-count', state.cart.length);
            } else {
                cartIcon.removeAttribute('data-count');
            }
        }
        
        if (favIcon) {
            if (state.favorites.length > 0) {
                favIcon.setAttribute('data-count', state.favorites.length);
            } else {
                favIcon.removeAttribute('data-count');
            }
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    window.openTab = openTab;
    updateHeaderCounters();
    
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'privacy') {
        openTab('privacy');
    } else {
        openTab('terms');
    }
}

window.initTermsPrivacyPage = initTermsPrivacyPage;