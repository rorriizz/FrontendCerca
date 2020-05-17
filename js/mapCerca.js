
    var stores = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
            "name": "Preparatoria Morelos",
            "sistema":"Sparrow - Ambience Data",
            "fecha":"-",
            "CO":0,
            "NO2":0,
            "O3":0,
            "SO2":0,
            "PM10":0,
            "PM25":0,
            "QA":'000000',
            "QA2":0 //Usado para indice general y modificar layer
        },
            "geometry": {
                "type": "Point",
                "coordinates": [
                -110.31258344650269,
                24.13914648384924
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
            "name": "Primaria 3 de mayo",
            "sistema": "Sparrow - Ambience Data",
            "fecha":"-",
            "CO":0,
            "NO2":0,
            "O3":0,
            "SO2":0,
            "PM10":0,
            "PM25":0,
            "QA":'000000',
            "QA2":0 //Usado para indice general y modificar layer
            
        },
            "geometry": {
                "type": "Point",
                "coordinates": [
                -110.29127597808838,
                24.17271422283604
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
            "name":"Preparatoria CETMAR 04",
            "sistema":"Sparrow - Ambience Data",
            "fecha":"-",
            "CO":0,
            "NO2":0,
            "O3":0,
            "SO2":0,
            "PM10":0,
            "PM25":0,
            "QA":'000000',
            "QA2":0 //Usado para indice general y modificar layer
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                -110.34492015838623,
                24.143307443557518
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
            "name":"Primaria Gustavo Diaz Ordaz",
            "sistema":"Sparrow - Ambience Data",
            "fecha":"-",
            "CO":0,
            "NO2":0,
            "O3":0,
            "SO2":0,
            "PM10":0,
            "PM25":0,
            "QA":'000000',
            "QA2":0 //Usado para indice general y modificar layer
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                -110.26368141174316,
                24.152235916383788
                ]
            }
         }//,
        // {
        //     "type": "Feature",
        //     "properties": {
        //     "name":"ECOPAZ",
        //     "sistema":"Sistema propio (CERCA)",
        //     "fecha":"-",
        //     "CO":0,
        //     "NO2":0,
        //     "O3":0,
        //     "SO2":0,
        //     "PM10":0,
        //     "PM25":0,
        //     "QACO":0,
        //     "QANO2":0,
        //     "QAO3":0,
        //     "QASO2":0,
        //     "QAPM10":0,
        //     "QAPM25":0
        //     },
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //         -110.26544094085693,
        //         24.197573525684145
        //         ]
        //     }
        // }
        ]
    }
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2VyY2FsYXBheiIsImEiOiJjazR4M2NicnUwMmZpM3JwMTJnOTdkcWQyIn0.o4qAYLKqQCqUBYHemRQjyg';
    var map = new mapboxgl.Map({
        container: 'map',
        //light-v10, dark-v10 ,outdoors-v11, satellite-v9
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [-110.315422,24.136152],
        zoom: 11
    });
    map.on('load', function(e) {
    // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    map.addSource('stores', {
    type: 'geojson',
    data: stores,
    cluster: false,
    clusterMaxZoom: 100, // Max zoom to cluster points on
    clusterRadius: 80 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'stores',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
    'step', ['get', 'point_count'],
    '#f28cb1', 100,'#38b208', 750, '#51bbd6'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]}
    });
    map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'stores',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12 }
    });
    map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'stores',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#38b208',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
    });

    map.addLayer({
    id: 'unclustered-text',
    type: 'symbol',
    source: 'stores',
    filter: ['!', ['has', 'point_count']],
    layout: {
        'text-field': ['get', 'name'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        'text-variable-anchor': ['top'],
        'text-radial-offset': 1,
    }
    });
    //LAYER PARA MODIFICAR COLORES CLUSTERS CON BASE EN LA NORMA, 0-4 = Bueno-Extremadamente malo
    map.addLayer(
        {
        id: 'unclustered-indice',
        type: 'circle',
        source: 'stores',
        layout: {
            'visibility': 'none'
        },
        // filter: ['!', ['has', 'point_count']],
        paint: {
        'circle-color': [
            'step',
            ['get', 'QA2'],
            '#38B208',
            1,
            '#EDB02D',
            2,
            '#FC7928',
            3,
            '#F93131',
            4,
            '#A8549D'
        ],
        'circle-radius': 10,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
        }
    });

    // const PM10 = ['==', ['get', 'PM10'], '-'];
    // map.addLayer({
    // 'id': 'PM_individual',
    // 'type': 'circle',
    // 'source': 'stores',
    // 'filter': [
    //     'all',
    //     PM10,
    //     ['!=', ['get', 'cluster'], true]
    // ],
    // 'paint': {
    // 'circle-color': '#8dd3c7',
    // 'circle-radius': 5
    // }
    // });
        // inspect a cluster on click
    map.on('click', 'clusters', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    var clusterId = features[0].properties.cluster_id;
    map.getSource('stores').getClusterExpansionZoom( clusterId,
    function(err, zoom) {
    if (err) return;
    map.easeTo({
    center: features[0].geometry.coordinates,
    zoom: zoom });
    }); 
    });
    map.on('click', function(e) {
    /* Determine if a feature in the "locations" layer exists at that point. */ 
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point']
    });
    
    /* If yes, then: */
    if (features.length) {
        var clickedPoint1 = features[0];
        //Actualizar datos en de store en JSON

        var clickedPoint = features[0];

        /* Fly to the point */
        flyToStore(clickedPoint);
        
        /* Close all other popups and display popup for clicked store */
        createPopUp(clickedPoint);
        
        /* Highlight listing in sidebar (and remove highlight for all other listings) */
        var activeItem = document.getElementsByClassName('active');
        if (activeItem[0]) {
        activeItem[0].classList.remove('active');
        }
        var listing = document.getElementById('listing-' + clickedPoint.properties.id);
    }
    });
    map.on('mouseenter', 'clusters', function() {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function() {
    map.getCanvas().style.cursor = ''; });
    
    //document.getElementById("demo").innerHTML = 5 + 6;
    stores.features.forEach(function(store, i){
    store.properties.id = i;
    });
    refresh();
    });
    //Usados para este c�digo:  
    //https://docs.mapbox.com/help/tutorials/building-a-store-locator/

function flyToStore(currentFeature) {  
  map.flyTo({
    center: currentFeature.geometry.coordinates, zoom:12
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
 
  if (popUps[0]) popUps[0].remove();
//SE AGREGAN VALORES DE POPUP PARA ESTACION ACTIVA
  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>'+ currentFeature.properties.name  +'</h3>' +
      '<h4> Datos de monitoreo:</h4>' + '<h5 > FECHA: </h5><p>'+ currentFeature.properties.fecha + '</p><br>'+ 
      '<h5> Monoxido Carbono:  </h5><p id="txtCont0">'+ currentFeature.properties.CO + '</p><br>' + '<h5> Dioxido de Nitrogeno: </h5><p id="txtCont1">'+ currentFeature.properties.NO2 + '</p><br>' +
      '<h5> Ozono:  </h5><p id="txtCont2">'+ currentFeature.properties.O3 + '</p><br>' + '<h5> Dioxido de Azufre:  </h5><p id="txtCont3">'+ currentFeature.properties.SO2 + '</p><br>'+
      '<h5> Material Particulado 10:  </h5><p id="txtCont4">'+ currentFeature.properties.PM10 + '</p><br>' + '<h5> Material Particulado 2.5:  </h5><p id="txtCont5">'+ currentFeature.properties.PM25 + '</p><br>')
    .addTo(map);
    indiceAQICSS(currentFeature);
   }
/* This will let you use the .remove() function later on */
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

var xmlHttp;
function refresh() {
    let xmlHttp = GetXmlHttpObject();
    if (xmlHttp==null)
    {
        alert ("Browser does not support HTTP Request");
        return;
    }else{
        var i = 0;
        /*while (i < stores.features.length){
            console.log(i)
            console.log(stores.features[i].properties.name)
            xmlHttp.open("GET", "http://cerca.org.mx/prueba_cerca.php?q=" + stores.features[i].properties.name, true);
            console.log(xmlHttp);
            i++;
        }*/
        (function loop(i, length) {
            if (i>= length) {
                return;
            }
            xmlHttp.open("GET", "http://cerca.org.mx/prueba_cerca.php?q=" + stores.features[i].properties.name, true);

            xmlHttp.responseType ="document";
            //console.log(stores.features[i].properties.name);
            //alert("Entro!" + str);
            xmlHttp.onreadystatechange = function() {
                //readystate 4 significa completado, status 200 significa existo (Esto para peticiones XMLHTTPResponse)
                if (this.readyState == 4 && this.status == 200) {
                    xmlDoc = xmlHttp.responseXML;
                    console.log(xmlDoc);
                    stores.features[i].properties.fecha = xmlDoc.getElementsByTagName("fecha")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.CO = xmlDoc.getElementsByTagName("CO")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.NO2 = xmlDoc.getElementsByTagName("NO2")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.O3 = xmlDoc.getElementsByTagName("O3")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.SO2 = xmlDoc.getElementsByTagName("SO2")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.PM10 = xmlDoc.getElementsByTagName("PM10")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.PM25 = xmlDoc.getElementsByTagName("PM25")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.QA= xmlDoc.getElementsByTagName("QA")[0].childNodes[0].nodeValue;
                    stores.features[i].properties.QA2 = Number(indiceAQI(stores.features[i].properties.QA));
                    loop(i + 1, length);
                }    
            }
            xmlHttp.send(null);
            sleep(1000);
            
        })(0, stores.features.length);
    }
}
function indiceAQI(cadenaQA){ //Calculo de indice para QA2
    QA = 0;
    for (const value of cadenaQA){//se recorre cadena "XXXXXX" hasta encontrar el mayor
            if(value>QA){
                QA = value;
            }
    }
    return QA;
}

function indiceAQICSS(Estaciones){ //Calculo de indice para modificar css
    QA = 0;
    value = Estaciones.properties.QA2;
    let tituloPopUp = document.querySelector(".mapboxgl-popup-content h3");//titulo popUp
    switch(value){
        case 0:  tituloPopUp.style.backgroundColor ="#38B208";break;
        case 1:  tituloPopUp.style.backgroundColor ="#EDB02D";break;
        case 2:  tituloPopUp.style.backgroundColor ="#FC7928";break;
        case 3:  tituloPopUp.style.backgroundColor ="#F93131";break;
        case 4:  tituloPopUp.style.backgroundColor ="#A8549D";break;
    }
    let txtCont;
    cadenaQA = Estaciones.properties.QA;
    let i = 0;
    QA2 = 0;
    for (const aux of cadenaQA){
        id = ('#txtCont' + i);
        let contaminante = document.querySelector(id);//titulo popUp
        switch(aux){
            case '0':  ;break;
            case '1':  contaminante.style.color ="#EDB02D";break;
            case '2':  contaminante.style.color ="#FC7928";break;
            case '3':  contaminante.style.color ="#F93131";break;
            case '4':  contaminante.style.color ="#A8549D";
        }
        i++;
    }
}
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var timer = window.setInterval(function() {
        map.getSource('stores').setData(stores);
        map.setLayoutProperty(
             'unclustered-indice',
             'visibility');
    }, 10000);

function GetXmlHttpObject()
 { 
 var objXMLHttp=null;
 if (window.XMLHttpRequest)
  {
  objXMLHttp=new XMLHttpRequest();
  }
 else if (window.ActiveXObject)
  {
  objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
 return objXMLHttp;
 }