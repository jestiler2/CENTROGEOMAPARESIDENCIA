function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getShareLink () {
    const idShare = getParameterByName("share");
    const radio = getParameterByName("radio");

    if (idShare) {
        removeLocation();
        restoreLocationShare(idShare, radio);
    } else {
        window.onload = (function () { finish() });
    }
}

getShareLink();