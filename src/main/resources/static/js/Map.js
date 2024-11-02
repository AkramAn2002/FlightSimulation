let currentAeroportId;
let isMouseOnCard = false;

document.querySelectorAll(".allPaths").forEach((countryPath) => {
    countryPath.addEventListener("mouseover", function (event) {
        const countryId = countryPath.id;

        if (currentAeroportId) {
            const previousCard = document.getElementById(`card-${currentAeroportId}`);
            if (previousCard) {
                document.body.removeChild(previousCard);
            }
        }
        const pointElement = createPointOnMap(countryPath);
        document.getElementById("allSvg").appendChild(pointElement);
        currentAeroportId = countryId;
        const cardElement = createCardElement(event, countryPath, currentAeroportId);
        document.body.appendChild(cardElement);
        $.ajax({
            url: `/api/aeroports/by-localisation?localisation=${countryId}`,
            type: 'GET',
            dataType: 'json',
            success: function (aeroport) {
                const aeroportTitleElement = cardElement.querySelector("#aeroportTitle");
                const aeroportList = cardElement.querySelector("#aeroportList");

                if (aeroportTitleElement && aeroportList) {
                    aeroportTitleElement.innerText = `Aéroport ${aeroport.localisation} Details`;
                    aeroportList.innerHTML = "";
                    for (const [key, value] of Object.entries(aeroport)) {
                        const listItem = document.createElement("li");
                        listItem.className = "list-group-item";
                        listItem.innerHTML = `<strong>${key}:</strong> ${value}`;
                        aeroportList.appendChild(listItem);
                    }

                    countryPath.style.fill = "pink";
                } else {
                    console.error('Elements not found: aeroportTitle or aeroportList.');
                }
            },
            error: function () {
                console.error('Erreur lors de la récupération des données aéroport.');
            }
        });
    });

    countryPath.addEventListener("mouseleave", function () {
        const countryId = countryPath.id;
        const previousPoint = document.getElementById(`point-${countryId}`);
        if (previousPoint) {
            document.getElementById("allSvg").removeChild(previousPoint);
        }

        const previousCard = document.getElementById(`card-${countryId}`);
        if (previousCard) {
            document.body.removeChild(previousCard);
        }
    });
});

function createPointOnMap(countryPath) {
    const countryId = countryPath.id;
    const bbox = countryPath.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    console.log("les coordonnées sont"+centerX+" et "+ centerY);
    const previousPoint = document.getElementById(`point-${countryId}`);
    if (previousPoint) {
        document.getElementById("allSvg").removeChild(previousPoint);
    }
    const pointElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pointElement.setAttribute("cx", centerX);
    pointElement.setAttribute("cy", centerY);

    pointElement.setAttribute("r", 5);
    pointElement.setAttribute("fill", "red");
    pointElement.id = `point-${countryId}`;
    console.log("les coordonnées sont"+centerX+" et "+ centerY);
    console.log('Point ajouté pour le pays:', countryId);

    return pointElement;
}



function createCardElement(event, countryPath, countryId) {
    const cardElement = document.createElement("div");
    cardElement.className = "cardd text-bg-dark";
    cardElement.style.maxWidth = "18rem";
    cardElement.style.position = "absolute";
    cardElement.style.overflow="hidden"
    cardElement.style.maxHeight="5000px"
    cardElement.style.border="2px solid black"
    cardElement.style.borderRadius="10px"
    cardElement.id = `card-${countryId}`;

    const x = event.clientX;
    const y = event.clientY;
    cardElement.style.top = y - 60 + "px";
    cardElement.style.left = x + 10 + "px";

    cardElement.innerHTML = `
        <div class="card-header" style="text-align: center">Aéroport Details</div>
        <div class="card-body">
            <h5 class="card-title" id="aeroportTitle">Aeroport Information</h5>
            <ul class="list-group" id="aeroportList">
            </ul>
        </div>
    `;
    cardElement.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    cardElement.addEventListener("mouseover", function () {
        isMouseOnCard = true;
    });

    cardElement.addEventListener("mouseleave", function () {
        isMouseOnCard = false;
    });

    return cardElement;
}
function calculateDirection(departRect, destinationRect) {
    const deltaX = destinationRect.left - departRect.left;
    const deltaY = destinationRect.top - departRect.top;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            return deltaY > 0 ? "SouthEast" : "NorthEast";
        } else {
            return deltaY > 0 ? "SouthWest" : "NorthWest";
        }
    } else {
        return deltaY < 0 ? "North" : "South";
    }
}
$(document).ready(function () {
    $.ajax({
        url: '/api/aeroports/map',
        type: 'GET',
        dataType: 'json',
        success: function (localisations) {
            var ul = $('<ul>');
            for (var i = 0; i < localisations.length; i++) {
                var li = $('<li>').text('Localisation de l\'aéroport ' + (i + 1) + ': ' + localisations[i]);
                ul.append(li);
            }
            $('#listeAeroports').append(ul);
        },
        error: function () {
            console.error('Erreur lors de la récupération des données aéroport.');
        }
    });
});
$.ajax({
    url: '/vols/vol',
    type: 'GET',
    dataType: 'json',
    success: function (vols) {
        var svg = document.getElementById('allSvg');
        var animationRequestId;
        var finalPosition = { x: 0, y: 0 };
        var coordonneesFixes = { x: 0, y: 0 };
        function calculateDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
        function trouverAeroportLePlusProche(distances) {
            var distanceMin = Infinity;
            var aeroportLePlusProche;

            for (var aeroportId in distances) {
                if (distances.hasOwnProperty(aeroportId)) {
                    var distance = distances[aeroportId];
                    if (distance < distanceMin) {
                        distanceMin = distance;
                        aeroportLePlusProche = { id: aeroportId, distance: distance };
                    }
                }
            }
            return aeroportLePlusProche;
        }


        vols.forEach(function (vol) {
            var departPoint = createePointOnMap(vol.aeroportDepart.localisation);
            var arrivePoint = createePointOnMap(vol.aeroportArrive.localisation);
            svg.appendChild(departPoint);
            svg.appendChild(arrivePoint);

            var svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            var trajetId = `trajet-${vol.id_Vol}`;
            svgLine.setAttribute("id", trajetId);
            svgLine.setAttribute("x1", departPoint.getAttribute("cx"));
            svgLine.setAttribute("y1", departPoint.getAttribute("cy"));
            svgLine.setAttribute("x2", arrivePoint.getAttribute("cx"));
            svgLine.setAttribute("y2", arrivePoint.getAttribute("cy"));
            svgLine.setAttribute("stroke", "black");
            svg.appendChild(svgLine);
            const x1 = departPoint.getAttribute("cx");
            const y1 = departPoint.getAttribute("cy");
            const x2 = arrivePoint.getAttribute("cx");
            const y2 = arrivePoint.getAttribute("cy");

            var distance = Math.sqrt(Math.pow(parseFloat(arrivePoint.getAttribute("cx")) - parseFloat(departPoint.getAttribute("cx")), 2) +
                Math.pow(parseFloat(arrivePoint.getAttribute("cy")) - parseFloat(departPoint.getAttribute("cy")), 2));

            var avionImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
            var avionSize = Math.min(20, distance / 10);
            avionImage.setAttribute("width", avionSize.toString());
            avionImage.setAttribute("height", avionSize.toString());
            avionImage.setAttribute("x", parseFloat(departPoint.getAttribute("cx")) - avionSize / 2);
            avionImage.setAttribute("y", parseFloat(departPoint.getAttribute("cy")) - avionSize / 2);
            avionImage.setAttribute("id", `avion-${vol.id_Vol}`);

            var direction = calculateDirection(departPoint.getBoundingClientRect(), arrivePoint.getBoundingClientRect());

            avionImage.setAttribute("href", "/images/plane.png");
            const angle = RotationAvion(y2, y1, x2, x1);
            svg.appendChild(avionImage);

            function RotationAvion(y2, y1, x2, x1) {
                var angleA = Math.atan2(y2 - y1, x2 - x1);
                angleA = angleA * (180 / Math.PI);
                return angleA;
            }
            var I =0;
            while (I==0) {
                finalPosition.x = parseFloat(avionImage.getAttribute("x")) + avionSize / 2;
                finalPosition.y = parseFloat(avionImage.getAttribute("y")) + avionSize / 2;
                var coordonneesFixes = {x: finalPosition.x, y: finalPosition.y};
                console.log("Les coordonnées de l'avion stoppé sont : " + coordonneesFixes.x + " et " + coordonneesFixes.y);
                I++;
            }
            var startTime = null;
            var duration = 5000;

            function updatePosition(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = (timestamp - startTime) / duration;

                if (progress < 1) {
                    var x = interpolate(parseFloat(departPoint.getAttribute("cx")), parseFloat(arrivePoint.getAttribute("cx")), progress);
                    var y = interpolate(parseFloat(departPoint.getAttribute("cy")), parseFloat(arrivePoint.getAttribute("cy")), progress);
                    avionImage.style.transformOrigin = `${x}px ${y}px`;
                    avionImage.style.transform = `rotate(${angle}deg)`;

                    avionImage.setAttribute("x", x - 10);
                    avionImage.setAttribute("y", y - 10);
                    console.log(vol.stop);
                    var distancesDepart = {};
                    var distancesArrivee = {};
                    var animationRequestId = null;

                    if (vol.stop) {
                        function getAeroportsProches(idAeroport, callback, distances) {
                            $.ajax({
                                url: '/api/aeroports/' + idAeroport + '/proches',
                                type: 'GET',
                                dataType: 'json',
                                success: function (aeroportsProches) {
                                    callback(aeroportsProches, distances);
                                },
                                error: function () {
                                    console.error('Erreur lors de la récupération des aéroports proches.');
                                }
                            });
                        }

                        console.log("La contrainte est vérifiée pour id = " + vol.id_Vol +
                            " et aeroport depart est " + vol.aeroportDepart.id_aeroport +
                            " et aeroport arrivee : " + vol.aeroportArrive.id_aeroport);

                        console.log("Coordonnées de l'aeroport de départ (X, Y) : " + vol.aeroportDepart.cordX + ", " + vol.aeroportDepart.cordY);
                        console.log("Coordonnées de l'aeroport d'arrivée (X, Y) : " + vol.aeroportArrive.cordX + ", " + vol.aeroportArrive.cordY);
                        var aeroportLePlusProcheDepart;
                        getAeroportsProches(vol.aeroportDepart.id_aeroport, function (aeroportsProchesDepart) {
                            aeroportsProchesDepart.forEach(function (aeroportProche) {
                                var distance = calculateDistance(
                                    finalPosition.x,
                                    finalPosition.y,
                                    aeroportProche.cordX,
                                    aeroportProche.cordY
                                );

                                distancesDepart[aeroportProche.id_aeroport] = distance;

                                console.log(`Distance entre ${aeroportProche.localisation} et avion égal ${distance}`);
                            });

                            aeroportLePlusProcheDepart = trouverAeroportLePlusProche(distancesDepart);
                            console.log("Aéroport de départ le plus proche :", aeroportLePlusProcheDepart);
                            getAeroportsProches(vol.aeroportArrive.id_aeroport, function (aeroportsProchesArrivee) {
                                aeroportsProchesArrivee.forEach(function (aeroportProche) {
                                    var distance = calculateDistance(
                                        finalPosition.x,
                                        finalPosition.y,
                                        aeroportProche.cordX,
                                        aeroportProche.cordY
                                    );

                                    distancesArrivee[aeroportProche.id_aeroport] = distance;

                                    console.log(`Distance entre ${aeroportProche.localisation} et avion égal ${distance}`);
                                });

                                var aeroportLePlusProcheArrivee = trouverAeroportLePlusProche(distancesArrivee);
                                console.log("Aéroport d'arrivée le plus proche :", aeroportLePlusProcheArrivee);
                                var cordXDepart;
                                var cordYDepart;
                                var cordXArrivee;
                                var cordYArrivee;
                                function getAeroportCoordinates(idAeroport, callback) {
                                    $.ajax({
                                        url: '/api/aeroports/' + idAeroport,
                                        type: 'GET',
                                        dataType: 'json',
                                        success: function (aeroport) {
                                            console.log("Coordonnées de l'aéroport (X, Y) :", aeroport.cordX + ", " + aeroport.cordY);

                                            if (idAeroport === aeroportLePlusProcheDepart.id) {
                                                cordXDepart = aeroport.cordX;
                                                cordYDepart = aeroport.cordY;
                                            } else if (idAeroport === aeroportLePlusProcheArrivee.id) {
                                                cordXArrivee = aeroport.cordX;
                                                cordYArrivee = aeroport.cordY;
                                            }
                                            if (callback) {
                                                callback();
                                            }
                                        },
                                        error: function () {
                                            console.error('Erreur lors de la récupération des coordonnées de l\'aéroport.');
                                        }
                                    });
                                }



                                function deplacerAvionVersAeroportProche(avion, xFinal, yFinal) {
                                    var startTimeDeplacement = null;
                                    var durationDeplacement = 3000;
                                    var initialDelay = 0;
                                    function updatePositionDeplacement(timestamp) {
                                        if (!startTimeDeplacement) startTimeDeplacement = timestamp;

                                        if (timestamp - startTimeDeplacement < initialDelay) {
                                            requestAnimationFrame(updatePositionDeplacement);
                                            return;
                                        }

                                        var progressDeplacement = (timestamp - startTimeDeplacement - initialDelay) / durationDeplacement;

                                        if (progressDeplacement < 1) {
                                            var xDeplacement = xFinal;
                                            var yDeplacement = yFinal;
                                            avion.setAttribute("x", xDeplacement - 10);
                                            avion.setAttribute("y", yDeplacement - 10);
                                            requestAnimationFrame(updatePositionDeplacement);
                                        } else {
                                            avion.style.display = "none";
                                        }
                                    }
                                    requestAnimationFrame(updatePositionDeplacement);
                                }


                                setTimeout(function () {
                                    if (aeroportLePlusProcheDepart.distance < aeroportLePlusProcheArrivee.distance) {
                                        console.log("L'aéroport le plus proche est pour le départ :", aeroportLePlusProcheDepart.id);
                                        getAeroportCoordinates(aeroportLePlusProcheDepart.id, function () {
                                            console.log("Utilisation de cordXDepart et cordYDepart ici :", cordXDepart, cordYDepart);
                                            deplacerAvionVersAeroportProche(avionImage, cordXDepart, cordYDepart);
                                        });
                                    } else {
                                        console.log("L'aéroport le plus proche est pour l'arrivée :", aeroportLePlusProcheArrivee.id);
                                        getAeroportCoordinates(aeroportLePlusProcheArrivee.id, function () {
                                            console.log("Utilisation de cordXArrivee et cordYArrivee ici :", cordXArrivee, cordYArrivee);
                                            deplacerAvionVersAeroportProche(avionImage, cordXArrivee, cordYArrivee);
                                        });
                                    }
                                }, 3000);
                            });
                        }, distancesDepart);

                        if (timestamp - startTime < 2500) {
                            animationRequestId = requestAnimationFrame(updatePosition);
                        }
                    } else {

                        animationRequestId = requestAnimationFrame(updatePosition);
                        setInterval(function () {
                            avionImage.style.display = "none";
                        }, 10000);
                    }}

                else {
                    if (vol.aeroportArrive.nbPlaceSol < vol.aeroportArrive.nbMax) {
                        avionImage.style.display = "none";
                    } else if (vol.aeroportArrive.nbPlaceSol > vol.aeroportArrive.nbMax) {
                        console.log("Condition atteinte. Nb de places sol > Nb maximal.");
                        const xArrive = parseFloat(arrivePoint.getAttribute("cx"));
                        const yArrive = parseFloat(arrivePoint.getAttribute("cy"));
                        console.log("coordonnées sont : " + xArrive + " et " + yArrive);
                        var xFinal =1200;
                        var yFinal =100;
                        fetch('/api/aeroports/decrementerNbSol?idaeroport=' + vol.aeroportArrive.id_aeroport, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',

                            },
                        })
                            .then(response => {
                                if (!response.ok) {
                                    console.error('Erreur lors de la décrémentation du nombre de places au sol. Statut:', response.status);
                                    return response.text().then(text => {
                                        console.error('Réponse du serveur:', text);
                                        throw new Error('Erreur lors de la décrémentation du nombre de places au sol.');
                                    });
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('Réponse du serveur:', data);
                            })
                            .catch(error => {
                                console.error('Erreur:', error);
                            });
                        var nouvelAvionImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
                        nouvelAvionImage.setAttribute("width", avionSize.toString());
                        nouvelAvionImage.setAttribute("height", avionSize.toString());
                        nouvelAvionImage.setAttribute("x", xArrive - avionSize / 2);
                        nouvelAvionImage.setAttribute("y", yArrive - avionSize / 2);
                        nouvelAvionImage.setAttribute("id", `nouvelAvion-${vol.id_Vol}`);
                        nouvelAvionImage.setAttribute("href", "/images/plane.png");
                        nouvelAvionImage.style.transition = "5s";
                        svg.appendChild(nouvelAvionImage);
                        animateNouvelAvion(nouvelAvionImage, xFinal, yFinal);

                    }
                }
            }

            function animateNouvelAvion(avion, xFinal, yFinal) {
                var startTimeNouvelAvion = null;
                var durationNouvelAvion = 10000;
                var initialDelay = 1000;

                function updatePositionNouvelAvion(timestamp) {
                    if (!startTimeNouvelAvion) startTimeNouvelAvion = timestamp;

                    if (timestamp - startTimeNouvelAvion < initialDelay) {
                        requestAnimationFrame(updatePositionNouvelAvion);
                        return;
                    }

                    var progressNouvelAvion = (timestamp - startTimeNouvelAvion - initialDelay) / durationNouvelAvion;


                    if (progressNouvelAvion < 1) {
                        var xNouvelAvion = xFinal;
                        var yNouvelAvion = yFinal;
                        avion.setAttribute("x", xNouvelAvion-10);
                        avion.setAttribute("y", yNouvelAvion-10);
                        requestAnimationFrame(updatePositionNouvelAvion);
                    } else {
                        avion.style.display = "none";
                    }
                }

                requestAnimationFrame(updatePositionNouvelAvion);
            }

            requestAnimationFrame(updatePosition);

            function interpolate(start, end, progress) {
                return start + (end - start) * progress;
            }
        });
    },
    error: function () {
        console.error('Erreur lors de la récupération des données des vols.');
    }
});

function createePointOnMap(localisation) {
    var countryPath = document.getElementById(localisation);
    const bbox = countryPath.getBBox();
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;
    const previousPoint = document.getElementById(`point-${localisation}`);
    if (previousPoint) {
        document.getElementById("allSvg").removeChild(previousPoint);
    }
    const pointElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pointElement.setAttribute("cx", centerX);
    pointElement.setAttribute("cy", centerY);
    pointElement.setAttribute("r", 5);
    pointElement.setAttribute("fill", "red");
    pointElement.id = `point-${localisation}`;


    console.log("les coordonnées sont"+centerX+" et "+ centerY+" de localisation : "+localisation);
    return pointElement;
}
function arreterAvion() {
    const avion = document.getElementById(`avion-${vol.id_Vol}`);

    if (avion) {
        const computedStyle = window.getComputedStyle(avion);
        const currentTransform = computedStyle.getPropertyValue("transform");
        avion.style.transform = currentTransform;
        avion.style.transition = "none";
    }
}