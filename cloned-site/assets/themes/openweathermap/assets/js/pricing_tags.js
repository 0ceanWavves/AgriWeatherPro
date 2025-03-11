const PAGE_EVENTS = {
  pricing: 'click_pricing_',
  api: 'click_api_',
  fullPrice: 'click_full_price_',
};

const getCurrentPage = () => {
  const path = window.location.pathname;
  if (path.includes('/price')) return 'pricing';
  if (path.includes('/api')) return 'api';
  if (path.includes('/full-price')) return 'fullPrice';
  return 'unknown';
};

const initializeEventTracking = () => {
  document.addEventListener('click', function (event) {
    const target = event.target.closest('[data-ga-action]');
    if (!target) return;

    const action = target.getAttribute('data-ga-action');
    const section = target.closest('[data-section]')?.getAttribute('data-section') || 'unknown';
    const currentPage = getCurrentPage();

    const eventPrefix = PAGE_EVENTS[currentPage] || 'click_';
    const fullAction = `${eventPrefix}${action}`;

    gtag('event', fullAction, {
      section: section,
      action: action,
      page: currentPage,
      event_label: `${action}_${section}`,
    });
  });
};

initializeEventTracking();