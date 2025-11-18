//page to navigate

function loadPage(page) {

    //get reference for the HTML ELEMENT BY ITS ID
    //contentFram is ifram element type
    let iframeElement = document.getElementById("contentFrame");

    //give the iframe the HTML ADDRESS
    iframeElement.src = page;

    // Close sidebar on mobile
    document.getElementById("sidebar").classList.remove("show");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("show");
}