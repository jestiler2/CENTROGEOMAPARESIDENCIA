function initSesion () {
    const cookie = "ID";
    if (checkCookie(cookie)) {
        const user = getCookie(cookie);
        console.log("Existe: " + user);
        id = user;
        hideCookie();
        const idShare = getParameterByName("share");
        if (!idShare && checkSession()) restoreSession();
    } else {
        setUserClientId();
        const day = "360";
        const user = getUserClientId();
        setCookie(cookie, user, day);
        console.log("Nuevo: " + user);
        id = user;
    }
}

function closeSesion () {
    id = null;
    const cookie = "ID";
    cleanUserClientId();
    removeCookie(cookie);
}

initSesion();
idShare = generateId();
