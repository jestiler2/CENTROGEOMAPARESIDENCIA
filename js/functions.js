function checkSelection (select) {
    return select === 'Choose...';
}

function updateRank (rank) {
    component = document.getElementById("currentRange")
    component.innerHTML = "Rango actual: " + rank + " metros."
}

function addOptions (element, options, sizes, extend = false) {
    let menu = document.getElementById(element);
    options.forEach((option, index) => {
        let add = document.createElement("option");
        add.setAttribute("value", option);
        let value = extend === false ? document.createTextNode(option + ' - ' + sizes[option]) :
                                       document.createTextNode(option + ' - ' + sizes[index]);
        add.appendChild(value);
        menu.appendChild(add);
    });
}

function removeOptions (element) {
    let menu = document.getElementById(element);
    for (i = menu.options.length; i >= 1; i--) {
        menu.remove(i);
    }
}

function resetOptions (element) {
    let menu = document.getElementById(element);
    menu.value = 'Choose...';
}

function toogleMessage () {
    $("#message-modal").modal('toggle');
}

function download (filename, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function shareSesion (type) {

    let url_share = server + "?share=";
    url_share += type === 0 ? idShare : idShare = generateId();

    if (markerMap['market'] !== null) url_share += "&radio=" + markerMap['radio'];

    let input = document.getElementById("share-url");
    input.style.display = "block";
    input.value = url_share;
    document.getElementById("text-share").innerText = "Se ha copiado el siguiente url a su portapapeles:";
    document.getElementById("share-button-now").disabled= true;
    document.getElementById("share-button-new").disabled= true;

    copy(url_share);

    if (mapLayers !== []) removeAndCreatedLocationShare(mapLayers);
}

function copy(text) {
    const type = 'text/plain';
    const blob = new Blob([text], {type});
    let data = [new ClipboardItem({[type]: blob})];

    navigator.clipboard.write(data).then(function() {
        console.log('Copiado!')
    }, function() {
        console.log('Ups! No se copio');
    });
}

function addPlace (base, now) {
    for (let i = 0; i < now['elements'].length; i ++) {
        const index = base['elements'].indexOf(now['elements'][i])
        if (index !== -1) {
            base['multiple'][now['elements'][i]] += now['multiple'][now['elements'][i]]
        } else {
            base['elements'].push(now['elements'][i])
            base['multiple'][now['elements'][i]] = now['multiple'][now['elements'][i]]
        }
    }
}

function addPlace2 (base, now) {
    for (let i = 0; i < now['elements'].length; i ++) {
        const index = base['elements'].indexOf(now['elements'][i])
        if (index !== -1) {
            base['multiple'][index] += now['multiple'][now['elements'][i]]
        } else {
            base['elements'].push(now['elements'][i])
            base['multiple'].push(now['multiple'][now['elements'][i]])
        }
    }
}

function sortObjectbyValue(object){
    let sortable = [];
    let objectSortable = {}

    for (let element in object) {
        sortable.push([element, object[element]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    sortable.reverse();

    sortable.forEach(element => {
        objectSortable [element[0]] = element[1]
    })

    return objectSortable
}