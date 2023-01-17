function getLocation () {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Obtener ubicación</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        'Seleccione el nivel de radio a explorar: <br/><br/>' +
        '<label for="input-range" class="form-label" id="currentRange">Rango actual: 500 metros.</label>' +
        "<input id='input-range' type='range' style='width: 100%' class='form-range' min='100' max='1000' value='500' oninput='updateRank(this.value)'>" +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary"' + " onclick='" + 'locationUser()' + "'>Aceptar</button>'" +
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function shareLocation () {
    let user = generateId();
    let url_share = server + "?share=" + user;
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Compartir mapa</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<span id="text-share">¿Como desea compartir esta ubicación?</span>' +
        "<input class='form-control' id='share-url' style='display: none; margin-top: 10px' type='text' disabled value=''>" +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary" id="share-button-now"' + " onclick='" + 'shareSesion(0)' + "'>Mapa actual</button>" +
        '<button type="button" class="btn btn-primary" id="share-button-new"' + " onclick='" + 'shareSesion(1)' + "'>Mapa actualizado</button>" +
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function removeAll () {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Reiniciar mapa</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '¿Desea reiniciar solamente los marcadores o todo el mapa?' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary"' + " onclick='" + 'removeAllMap(false, true, false)' + "'>Solo marcadores</button>" +
        '<button type="button" class="btn btn-secondary"' + " onclick='" + 'removeAllMap(true, true, true)' + "'>Todo el mapa</button>" +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function removeLayer (index) {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Eliminar ubicación en el mapa</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '¿Realmente desea eliminar esta ubicacióm marcada en el mapa?' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary"' + "onclick='" + 'removeLayerSelect(' + index + ')' + "'>Aceptar</button>'" +
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function restoreSession () {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="0" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Sesión iniciada</h5>' +
        '</div>' +
        '<div class="modal-body">' +
        'Existe una sesión registrada anteriormente ¿desea restaurarla?' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary"' + "onclick='" + 'restoreLocation()' + "'" + ' data-dismiss="modal">Restaurar</button>' +
        '<button type="button" class="btn btn-secondary"' + "onclick='" + 'removeLocation()' + "'" + ' data-dismiss="modal">Eliminar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function getDetailsPlace (data, exact) {
    if (exact) {
        
        data [0] = data[0] !== 'None' ? data[0] : 'No disponible';
        data [1] = data[1] !== 'None' ? data[1] : 'No disponible';
        data [2] = data[2] !== 'None' ? data[2] : 'No disponible';
        data [3] = data[3] !== 'None' ? data[3] : 'No disponible';
        data [4] = data[4] !== 'None' ? data[4] : 'No disponible';
        data [5] = data[5] !== 'None' ? data[5] : 'No disponible';
        data [6] = data[6] !== 'None' ? data[6] : 'No disponible';

        document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
            ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
            '<div class="modal-dialog modal-dialog-centered" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title" id="exampleModalLongTitle">Información de la ubicación</h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<table class="table">' +
            '<tbody>' +
            '<tr>' +
            '<th style="border-top-color: transparent !important;" scope="row"><i class="fa-sharp fa-solid fa-location-dot"></i></th>' +
            '<td style="border-top-color: transparent !important;">Nombre</td>' +
            '<td style="word-wrap: break-word; border-top-color: transparent !important;">' + data[0] + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row"><i class="fa-solid fa-people-pulling"></i></th>' +
            '<td>Calificación</td>' +
            '<td style="word-wrap: break-word;">' + data[1] + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row"><i class="fa-regular fa-clock"></i></th>' +
            '<td>Estado</td>' +
            '<td style="word-wrap: break-word;">' + data[2] + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row"><i class="fa-solid fa-location-crosshairs"></i></th>' +
            '<td>Dirección</td>' +
            '<td style="word-wrap: break-word;">' + data[3] + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row"><i class="fa-solid fa-phone"></i></th>' +
            '<td>Numero de contacto</td>' +
            '<td style="word-wrap: break-word;">' + data[4] + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row"><i class="fa-solid fa-calendar-days"></i></th>' +
            '<td>Horario</td>' +
            '<td style="word-wrap: break-word;">' + data[5] + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th style="border-bottom-color: transparent !important;" scope="row"><i class="fa-solid fa-globe"></i></th>' +
            '<td style="border-bottom-color: transparent !important;">Página web</td>' +
            '<td style="word-wrap: break-word;border-bottom-color: transparent !important;">' + data[6] + '</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    } else {
        document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
            ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
            '<div class="modal-dialog modal-dialog-centered" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title" id="exampleModalLongTitle">Información de la ubicación</h5>' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body" style="overflow-wrap: break-word;">' +
            '<div style="display: flex;justify-content: center;flex-direction: column;align-content: center;flex-wrap: nowrap;align-items: center;">' +
            '<br>' +
            '<img style="max-width: 150px" src="../img/not_found.webp">' +
            '<br><br>' +
            '<p style="text-align: center;">No se pudo recuperar la información exacta del sitio.</p>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    $("#message-modal").modal('toggle');
}

function setMessageError (error) {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Información de la ubicación</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body" style="overflow-wrap: break-word;">' +
        '<div style="display: flex;justify-content: center;flex-direction: column;align-content: center;flex-wrap: nowrap;align-items: center;">' +
        '<br>' +
        '<img style="max-width: 150px" src="../img/error.webp">' +
        '<br><br>' +
        '<p style="text-align: center;">Ha ocurrido un error fatal: ' + error + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary" data-dismiss="modal">Aceptar</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    $("#message-modal").modal('toggle');
}

function controlPlace () {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Control de mapa</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '¿Desea realizar una acción sobre todas las ubicaciones del mapa?' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary"' + "onclick='" + 'controlLayer(1)' + "'>Visualizar</button>'" +
        '<button type="button" class="btn btn-secondary"' + "onclick='" + 'controlLayer(2)' + "'>Alternar</button>'" +
        '<button type="button" class="btn btn-secondary"' + "onclick='" + 'controlLayer(3)' + "'>Ocultar</button>'" +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function searchAll () {
    document.getElementById("overall-modal").innerHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Busqueda extensa</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        'El área del mapa es extenso ¿Desea realizar una busqueda interativa o completa?' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-primary"' + "onclick='" + 'gridLocationMap (1)' + "'>Interativa</button>'" +
        '<button type="button" class="btn btn-secondary"' + "onclick='" + 'gridLocationMap (2)' + "'>Completa</button>'" +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#message-modal").modal('toggle');
}

function listArchive () {
    let documentHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Lista de ubicaciones</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>Seleccione una lista de ubicación de la lista:</p>' +
        '<table class="table">' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">Location</th>' +
        '<th scope="col">Type</th>' +
        '<th scope="col">Position</th>' +
        '<th scope="col">Action</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    const recovery = getList()
    console.log(recovery)

    for (let i = 0; i < recovery[0][5].length; i ++) {
        const position = recovery[0][8][i] ? "" + recovery[0][8][i] + "\n" + recovery[0][9][i] + "\n" + recovery[0][10][i] + "\n" + recovery[0][11][i] :
            "" + recovery[0][1][i] + "\n" + recovery[0][2][i] + "\n" + recovery[0][3][i] + "\n" + recovery[0][4][i]

        documentHTML += '<tr>' +
                        '<td>' + recovery[0][5][i] + '</td>' +
                        '<td>' + recovery[0][6][i] + '</td>' +
                        '<td>' + position + '</td>' +
                        '<td><a style="text-decoration: none" href="javascript:viewGeoJSON(' + (recovery[0][6][i] === 'amenity' ? 0 : recovery[0][6][i] === 'highway' ? 2 : 3) + ",'" + recovery[0][5][i] + "'," + recovery[0][1][i] + "," + recovery[0][2][i] + "," + recovery[0][3][i] + "," + recovery[0][4][i] + "," + recovery[0][8][i] + "," + recovery[0][9][i] + "," + recovery[0][10][i] + "," + recovery[0][11][i] + ')" <i class="fa-solid fa-eye"></i></a></td>' +
                        '</tr>'
    }

    documentHTML += '</tbody></table></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    document.getElementById("overall-modal").innerHTML = documentHTML
    $("#message-modal").modal('toggle');
}

function listDownload () {
    let documentHTML = '<div class="modal fade" id="message-modal" tabindex="-1" role="dialog"' +
        ' aria-labelledby="exampleModalCenterTitle" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" role="document">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLongTitle">Lista de ubicaciones</h5>' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<p>Seleccione una lista de ubicación de la lista:</p>' +
        '<table class="table">' +
        '<thead>' +
        '<tr>' +
        '<th scope="col">Location</th>' +
        '<th scope="col">Type</th>' +
        '<th scope="col">Position</th>' +
        '<th scope="col">Action</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';

    const recovery = getList()
    console.log(recovery)

    for (let i = 0; i < recovery[0][5].length; i ++) {
        const position = recovery[0][8][i] ? "" + recovery[0][8][i] + "\n" + recovery[0][9][i] + "\n" + recovery[0][10][i] + "\n" + recovery[0][11][i] :
            "" + recovery[0][1][i] + "\n" + recovery[0][2][i] + "\n" + recovery[0][3][i] + "\n" + recovery[0][4][i]

        documentHTML += '<tr>' +
            '<td>' + recovery[0][5][i] + '</td>' +
            '<td>' + recovery[0][6][i] + '</td>' +
            '<td>' + position + '</td>' +
            '<td><a style="text-decoration: none" href="javascript:downloadGeoJSON(' + (recovery[0][6][i] === 'amenity' ? 0 : recovery[0][6][i] === 'highway' ? 2 : 3) + ",'" + recovery[0][5][i] + "'," + recovery[0][1][i] + "," + recovery[0][2][i] + "," + recovery[0][3][i] + "," + recovery[0][4][i] + "," + recovery[0][8][i] + "," + recovery[0][9][i] + "," + recovery[0][10][i] + "," + recovery[0][11][i] + ')" <i class="fa-solid fa-download"></i></a></td>' +
            '</tr>'
    }

    documentHTML += '</tbody></table></div>' +
        '</div>' +
        '</div>' +
        '</div>';
    document.getElementById("overall-modal").innerHTML = documentHTML
    $("#message-modal").modal('toggle');
}
