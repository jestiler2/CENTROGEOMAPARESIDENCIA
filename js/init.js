function loadingOld() {
    $('body').loadingModal('destroy');
    $('body').loadingModal({
        text: '<b>Cargando</b>',
        eText: ['Espere un momento por favor...',
                'Seguimos trabajando, un momento por favor...',
                'Esto está tardando un poco más de lo normal, por favor espere...',
                'A ocurrido un error, recargue el sitio y vuelva a intentarlo']
    });
    $('body').loadingModal('show');
}

function loading() {
    return new Promise((resolve, reject) => {
        try {
            $('body').loadingModal('destroy');
            $('body').loadingModal({
                text: '<b>Cargando</b>',
                eText: ['Espere un momento por favor...',
                    'Seguimos trabajando, un momento por favor...',
                    'Esto está tardando un poco más de lo normal, por favor espere...',
                    'A ocurrido un error, recargue el sitio y vuelva a intentarlo']
            });
            $('body').loadingModal('show');
            resolve();
        } catch (error) {
            reject(new Error("Fallo la tarea de carga"));
        }
    });
}

function loadingGrid() {
    return new Promise((resolve, reject) => {
        try {
            $('body').loadingModal('destroy');
            $('body').loadingModal({
                text: '<b>Cargando</b>',
                eText: ['Esto puede demorar un poco, por favor espere...']
            });
            $('body').loadingModal('show');
            resolve();
        } catch (error) {
            reject(new Error("Fallo la tarea de carga"));
        }
    });
}

function finish() {
    $('body').loadingModal('hide');
}

loading();
