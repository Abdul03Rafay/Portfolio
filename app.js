document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    const indicator = document.querySelector('.tab-indicator');

    function updateIndicator(element) {
        indicator.style.width = `${element.offsetWidth}px`;
        indicator.style.left = `${element.offsetLeft}px`;
    }

    function switchTab(e) {
        const tab = e.target;
        const tabId = tab.dataset.tab;

        // Update tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update content
        contents.forEach(c => c.classList.remove('active'));
        document.getElementById(`${tabId}-content`).classList.add('active');

        // Update indicator
        updateIndicator(tab);
    }

    // Initialize tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', switchTab);
    });

    // Set initial state
    updateIndicator(document.querySelector('.tab-button.active'));
});