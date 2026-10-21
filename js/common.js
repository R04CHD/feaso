function switchTab(tabId) {
  document
    .querySelectorAll(".sc-content")
    .forEach((el) => el.classList.add("hidden"));
  document
    .querySelectorAll(".sc-content")
    .forEach((el) => el.classList.remove("block"));

  document.querySelectorAll(".sc-tab").forEach((el) => {
    el.classList.remove("border-indigo-600", "text-indigo-600");
    el.classList.add("text-stone-500", "border-transparent");
  });

  const activeContent = document.getElementById("content-" + tabId);
  if (activeContent) {
    activeContent.classList.remove("hidden");
    activeContent.classList.add("block");
  }

  const activeTab = document.getElementById("tab-" + tabId);
  if (activeTab) {
    activeTab.classList.add("border-indigo-600", "text-indigo-600");
    activeTab.classList.remove("text-stone-500", "border-transparent");
  }
}

function setupMobileNavigation() {
  const menuButton = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  function closeMenu(returnFocus = false) {
    const wasExpanded = menuButton.getAttribute("aria-expanded") === "true";
    mobileMenu.classList.add("hidden");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.firstElementChild.textContent = "☰";
    if (returnFocus && wasExpanded) menuButton.focus();
  }

  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    mobileMenu.classList.toggle("hidden", isExpanded);
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation menu" : "Close navigation menu",
    );
    menuButton.firstElementChild.textContent = isExpanded ? "☰" : "×";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280) closeMenu();
  });
}
