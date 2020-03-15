import angular from 'angular';
import $ from 'jquery';
//import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment-jalaali';
import {datePicker} from '../../Components';

const Search = angular.module('Search', [datePicker]);

Search.controller('SearchCtrl', ['$scope','$rootScope',function ($scope, $rootScope) {
    var config = {
        maxRooms: 4,
        maxAdultPerRoom: 4,
        maxChildrenPerRoom: 3,
        maxGuestPerRoom: 6,

        maxStayLenght: 30,
        maxChildAge: 12,
        minChildAge: 1,

        roomToggleSpeed: 300,
        wizardStepSpeed: 300,
    };

    //this scope added for disable-enabling room selector's buttons
    $scope.config = config;
    var searchData;
    if (!$scope.searchData)
        searchData = {
            destination: null,
            rooms: [],
            nationality: null,
            checkin: null,
            checkout: null
        };
    else
        searchData = $scope.searchData;
    var adultId = 0;
    var childId = 0;
    var stepCount = Math.min($('.step-header-item').length, $('.step-footer-item').length);

    $scope.hrCity = hrCity;
    $scope.nextStep = nextStep;
    $scope.prevStep = prevStep;
    $scope.goToStep = goToStep;
    $scope.wizard = wizard;
    //$scope.countNights = countNights;

    // $scope.addAdult = addAdult;
    $scope.removeAdult = removeAdult;
    $scope.adultsCount = adultsCount;

    $scope.addChild = addChild;
    $scope.getChildAge = getChildAge;
    $scope.removeChild = removeChild;
    $scope.childrenCount = childrenCount;

    // $scope.addRoom = addRoom;
    $scope.removeRoom = removeRoom;
    $scope.roomsCount = roomsCount;

    $scope.toggleRoom = toggleRoom;
    $scope.inRange = inRange;
    $scope.validateCheckinDate = validateCheckinDate;
    $scope.validateCheckoutDate = validateCheckoutDate;

    $scope.validateSearchData = validateSearchData;
    $scope.searchFormSubmitted = searchFormSubmitted;
    $scope.notif = notif;
    // $scope.user_guid = new user_guid(searchData, config, {
    //     childrenCount: childrenCount,
    //     adultsCount: adultsCount
    // });
    $scope.detailsOpen = false;
    //var bgDetails = backgroundSetting($scope.searchByHotelName);
    // if (bgDetails) {
    //     $scope.pointOfInterest = {
    //         status: 'loading',
    //         bgImg: bgDetails.imageName,
    //         data: bgDetails.data,
    //     };
    // }
    if ($('#destination-autocomplete').length === 0) $scope.searchFormType = 'wizard';
    else $scope.searchFormType = 'inline';
    $scope.config = config;
    $scope.step = 1;
    $scope.endlessLoading = {show: false};
    $scope.seachCitiesMaxHeight = getSeachCitiesMaxHeight();
    $scope.cities = [];
    // $scope.calendar = {
    //     checkin: new ttCalendar(),
    //     checkout: new ttCalendar()
    // };
    $scope.nationalities = [];
    $scope.destSearch = null;
    $scope.natioSearch = null;
    $scope.searchData = searchData;
    // oneTimeProcess();
    if ($scope.searchFormType === 'wizard') {
        wizard();
        initBgMap();
    } else {
        if (!$scope.searchData.checkin) {
            $scope.searchData.mCheckin = moment();
            $scope.searchData.checkin = $scope.searchData.mCheckin.format("DD/MM/YYYY");
        }
        if (!$scope.searchData.checkout) {
            $scope.searchData.mCheckout = moment().add(1, 'day').startOf('day');
            $scope.searchData.checkout = $scope.searchData.mCheckout.format("DD/MM/YYYY");
        }


        /*$scope.checkInOutContainer = $('#checkin-checkout-datepicker');
        $scope.checkInOutContainer.daterangepicker({
            autoApply: true,
            startDate: $scope.searchData.checkin,
            endDate: $scope.searchData.checkout,
            minDate: moment().format("DD/MM/YYYY"),
            locale: {format: "DD/MM/YYYY"}
        }, function (start, end) {

            $scope.searchData.checkin = start.format('DD/MM/YYYY');
            $scope.searchData.checkout = end.format('DD/MM/YYYY');
            $scope.nightCountInput = end.diff(start, 'day');
            $scope.$apply();
        });
        $scope.nightCountInput = 1;*/
    }
    $scope.searchData.func = function (checkin, checkout) {
        $scope.searchData.mCheckin = checkin;
        $scope.searchData.checkin = $scope.searchData.mCheckin.format("DD/MM/YYYY");
        $scope.searchData.mCheckout = checkout;
        $scope.searchData.checkout = $scope.searchData.mCheckout.format("DD/MM/YYYY");
        $scope.nightCountInput = checkout.diff(checkin, 'day');
        $scope.searchData.show = false;
    };
    $scope.searchData.show = false;
    $scope.$watch('destSearch', function (newVal) {
        if (!newVal || newVal === $scope.selectedDestination) {
            if ($scope.destLoader) $scope.destLoader.hide();
            return;
        }
        $scope.destLoader = new endlessLoader($('#destSearchLabel'), 'inputLoader');
        $scope.destLoader.show();
        getCities(newVal, function (cities) {
            $scope.destLoader.hide();
            cities = sortBySimilarity(cities, newVal, 5, function (city) {
                return city.CityName;
            });
            $scope.cities = cities;
            if ($scope.searchFormType === 'wizard')
                updateMaxHeight();
            else $scope.showCities = true;
            $scope.$apply();
        });
    });
    $scope.selectDestination = function (destination) {
        $scope.searchData.destination = destination;
        $scope.destSearch = destination.CityName + ', ' + destination.CountryCode;
        $scope.selectedDestination = destination.CityName + ', ' + destination.CountryCode;
        $scope.showCities = false;
    };
    $scope.selectNationality = function (nationality) {
        $scope.searchData.nationality = nationality;
        $scope.natioSearch = nationality.CountryName;
        $scope.selectedNationality = nationality.CountryName;
        $scope.showNations = false;
    };
    $scope.$watch('natioSearch', function (newVal) {
        if (!newVal || newVal === $scope.selectedNationality) {
            if ($scope.nationLoader) $scope.nationLoader.hide();
            return;
        }
        $scope.nationLoader = new endlessLoader($('#nationSearchLabel'), 'inputLoader');
        $scope.nationLoader.show();
        getNationalities(function (nationalities) {
            $scope.nationLoader.hide();
            nationalities = sortBySimilarity(nationalities, newVal, 40, function (nat) {
                return nat.CountryName;
            });
            $scope.nationalities = nationalities.slice(0, 10);
            if ($scope.searchFormType === 'inline') $scope.showNations = true;
            $scope.$apply();
        });
    });
    $scope.$watch('step', function (newVal) {
        if (!newVal) return;
        $scope.user_guid.stepChanged(newVal);
    });
    $rootScope.$watch('searchData', function (newVal) {
        if (!newVal) return;
        searchData = JSON.parse(JSON.stringify(newVal));
        $scope.searchData = searchData;
        $scope.searchData.rooms.forEach(function (room) {
            var adults = [];
            var count = parseInt(room.adults);
            for (var i = 0; i < count; i++) {
                adults.push({id: i, type: 'adult'});
            }
            room.adults = adults;
        });
        if ($scope.searchData.destination) {
            var city = $scope.searchData.destination;
            $scope.destSearch = city.CityName + ', ' + city.CountryCode;
        }
        if ($scope.searchData.nationality) {
            $scope.natioSearch = $scope.searchData.nationality.CountryName;
        }
        wizard();
    });

    function validateSearchData() {
        return $scope.searchData.destination &&
            $scope.searchData.rooms &&
            $scope.searchData.nationality &&
            $scope.searchData.checkin &&
            $scope.searchData.checkout
    }

    // function oneTimeProcess() {
    //     var roomsContainer = $('#step-footer-2');
    //     var rooms = roomsContainer.find('.search-room-item');
    //
    //     // add at least one room
    //     if (!searchData.rooms.length) addRoom();
    //
    //     // collaps all existing rooms
    //     for (var i = 0; i < rooms.length; i++) {
    //         var roomElem = $(rooms[i]);
    //         var dom = getRoomPropDOM(roomElem);
    //         if (!dom.length) continue;
    //         dom.css('height', 0);
    //     }
    //
    //     // collaps room when added
    //     roomsContainer.bind('DOMNodeInserted', function (ev) {
    //         var target = $(ev.target);
    //         if (!target.hasClass('search-room-item')) return;
    //         var prp = getRoomPropDOM(target);
    //         prp.css('height', 0);
    //     });
    //
    //     // show common nationalities
    //     getNationalities(function (nat) {
    //         nat = sortBySimilarity(nat, 'china', 10, function (n) {
    //             return n.CountryName;
    //         });
    //         $scope.nationalities = nat;
    //         $scope.$apply();
    //     })
    // }

    function wizard(value) {
        switch ($scope.step) {
            case 1:
                if (!value) {
                    $scope.step = 1;
                    goToStep(1);
                    break;
                }
                $scope.searchData.destination = value;
                updateMap(value);
                $scope.cities = [];
                value = null;

            case 2:
                if (!value) {
                    $scope.step = 2;
                    goToStep(2);
                    break;
                }
                $scope.searchData.rooms = value;
                value = null;

            case 3:
                if (!value) {
                    $scope.step = 3;
                    goToStep(3);
                    break;
                }
                $scope.searchData.nationality = value;
                $scope.natioSearch = value.CountryName;
                value = null;

            case 4:
                if (!value || !validateCheckinDate(value)) {
                    $scope.step = 4;
                    goToStep(4);
                    break;
                }
                $scope.searchData.checkin = value;
                var nextDay = moment.unix(value).add(1, 'day');
                $scope.calendar.checkout = new ttCalendar(nextDay.year(), nextDay.month());
                value = null;

            case 5:
                if (!value || !validateCheckoutDate(value)) {
                    $scope.step = 5;
                    goToStep(5);
                    break;
                }
                $scope.searchData.checkout = value;
                value = null;
        }
    }

    function searchFormSubmitted() {
        if (!$scope.searchForm.$valid)
            return notify.error('Search form is invalid.'.t());
        var btnElem = $('#searchFormSubmit');
        btnElem.html('');
        new endlessLoader(btnElem, 'btnLoader').show();
        var obj = prepareSearchData();
        new AjaxRequest(constants.ajaxUrl.getSearchId, obj, function (res) {
            if (!res.success)
                return notify.error('There was a problem connecting to server. Please try again later.'.t());
            var searchId = res.result.response.searchID;
            var url = '/Result/' + encodeURIComponent(searchId);
            var stringifySearchData = JSON.stringify(obj);
            localStorage.searchData = stringifySearchData;
            window.location.href = url;
        })
    }

    function prepareSearchData() {
        var obj = JSON.parse(JSON.stringify($scope.searchData));
        // obj.checkin[1] = paddNumber(obj.checkin[1]+1,2);
        // obj.checkin[2] = paddNumber(obj.checkin[2],2);
        // obj.checkout[1] = paddNumber(obj.checkout[1]+1,2);
        // obj.checkout[2] = paddNumber(obj.checkout[2],2);
        //
        // obj.checkin = obj.checkin.join('-');
        // obj.checkout = obj.checkout.join('-');
        if (typeof obj.checkin === 'string' && obj.checkin.indexOf('/') > -1) {
            obj.checkin = obj.checkin.replace(/\//g, '-');
            obj.checkout = obj.checkout.replace(/\//g, '-');
        } else {
            obj.checkin = moment.unix(obj.checkin).format('DD-MM-YYYY');
            obj.checkout = moment.unix(obj.checkout).format('DD-MM-YYYY');
        }
        obj.rooms.forEach(function (value) {
            value.adults = value.adults.length;
        });
        return obj;
    }

    function updateMaxHeight() {
        $scope.seachCitiesMaxHeight = getSeachCitiesMaxHeight();
    }

    function hrCity(city) {
        return city.CityName + ' • ' + city.CountryCode;
    }

    function getCities(key, callback) {
        key = key.replace(/,/g, '');
        $.post('/Ajax/Search', {search: key}, function (res) {
            if ($scope.destSearch !== key) return;
            if (typeof callback === 'function') callback(res);
        }, 'json');
    }

    function getNationalities(callback) {
        new AjaxRequest('/Ajax/Nationalities', function (res) {
            if (!res.success) return;
            if (typeof callback === 'function') callback(res.result.response.nationalities);
        });
    }

    function getSeachCitiesMaxHeight() {
        var elem = document.getElementsByClassName('search-cities')[0];
        if (!elem) return;
        var rect = elem.getBoundingClientRect();
        var rootFont = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'));
        var bottomMargin = rootFont * 3;
        var height = window.innerHeight - rect.top - bottomMargin;

        if (!window.onresize) {
            window.onresize = function (ev) {
                updateMaxHeight();
                $scope.$apply();
            };
        }

        return height + 'px';
    }

    function goToStep(step) {
        $scope.step = step;
        var speed = config.wizardStepSpeed;
        var active = getActive();
        var steps = getSteps();
        var target = getTarget();
        var diactive = getDiactive();
        var all = getAll();

        if (!target.header.length || !target.footer.length)
            return console.error('Cannot find target step DOM.');
        // if(active.header.length > 1 || active.footer.length > 1)
        //     return console.error('Multiple active steps detected.');

        // diactive.header.hide();
        // diactive.footer.hide();

        // if(!active.header.is(target.header)) {
        //     hideElem(active.header);
        //     hideElem(active.footer);
        //     showElem(target.header);
        //     showElem(target.footer);
        // }


        for (var i = 0; i < all.length; i++) {
            var elem = all[i];
            if (elem.header.is(target.header)) {
                showElem(elem.header);
                showElem(elem.footer);
            } else {
                if (elem.header.css('display') === 'none') continue;
                if (elem.footer.css('display') === 'none') continue;
                hideElem(elem.header);
                hideElem(elem.footer);
            }
        }

        function getAll() {
            var list = [];
            var headers = $('.step-header-item');
            var footers = $('.step-footer-item');

            for (var i = 0; i < stepCount; i++) {
                list.push({
                    header: $(headers[i]),
                    footer: $(footers[i])
                });
            }
            return list;
        }

        function getActive() {
            return {
                header: $('.step-header-item.active'),
                footer: $('.step-footer-item.active')
            };
        }

        function getSteps() {
            return {
                header: $('.step-header-item'),
                footer: $('.step-footer-item')
            };
        }

        function getTarget() {
            return {
                header: $('#step-header-' + step),
                footer: $('#step-footer-' + step)
            };
        }

        function getDiactive() {
            return {
                header: $('.step-header-item:not(.active)'),
                footer: $('.step-footer-item:not(.active)')
            };
        }

        function hideElem(elem, callback) {
            elem.animate({opacity: 0, height: 0}, speed, function () {
                // if(elem.is(target.header) || elem.is(target.footer)) return;
                elem.removeClass('active');
                elem.hide();
                if (typeof callback === 'function') callback();
            });
        }

        function showElem(elem, callback) {
            // elem.hide();
            elem.css('height', '');
            var height = elem.height();

            elem.show();
            elem.css('height', 0);
            elem.css('opacity', 0);
            elem.animate({opacity: 1, height: height}, speed, function () {
                elem.show();
                elem.addClass('active');
                elem.css('height', '');
                if (typeof callback === 'function') callback();
            });
        }
    }

    function prevStep() {
        $scope.step--;
        if ($scope.step < 1) $scope.step = 1;
        wizard();
    }

    function nextStep() {
        $scope.step++;
        if ($scope.step > stepCount)
            $scope.step = stepCount;
        wizard();
    }

    function initBgMap() {
        if (!window.mapboxgl) return;
        var here = {
            lat: 28.171801,
            lng: 55.6532437
        };
        var container = document.getElementById('bg-map-container');
        var map = document.querySelector('#bg-map-container #map');

        // eval("'AmHQ7XFt6JrW2DS35Ev_g-.QfignamZDbmp2N4AXcyg2Z2Azai92M4YjepNmI6ISYiwiI49mYwFWbiojI1Jye.kp'=nekoTssecca.lgxobpam".split('').reverse().join(''));
        mapboxgl.accessToken = 'pk.eyJ1IjoidHR2ZDk0IiwiYSI6ImNqbGFlczZsODQzbGsza3FrNzQ5d2oxNHkifQ.Uby4jx1xyfr4oZ_ec7QwXQ';
        $scope.map = new mapboxgl.Map({
            container: map,
            style: 'mapbox://styles/ttvd94/cjlafa0n22udb2rrt4h4d6qpk',
            center: [here.lng, here.lat],
            pitch: 80,
            zoom: 5
        });
    }

    function updateMap(city) {
        if (!window.mapboxgl) return;
        if (!city.CityName) return;
        if (!$scope.map) return;

        var address = city.CityName + ', ' + city.CountryCode;
        var container = $('#bg-map-container');
        var map1 = container.find('#map');
        var map2 = $('<div id="map2" class="no-transition"></div>');
        if (!$('#map2').length)
            container.prepend(map2);

        map1.fadeIn('slow');

        getLocationFromAddress(address, function (loc) {
            var pitch = 0;
            var bearing = 90;
            $scope.map2 = new mapboxgl.Map({
                container: 'map2',
                style: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
                center: [loc.lng, loc.lat],
                pitch: pitch,
                bearing: bearing,
                zoom: 11.5
            });

            map1.css('z-index', 2);
            map2.css('z-index', 1);

            setTimeout(function () {
                $scope.map.flyTo({
                    center: [loc.lng, loc.lat],
                    zoom: 15,
                    curve: 1.42,
                    pitch: pitch,
                    bearing: bearing,
                    duration: 30000
                });

                setTimeout(function () {
                    map2.show();
                    $scope.map2.flyTo({
                        center: [loc.lng, loc.lat],
                        zoom: 12,
                        pitch: pitch,
                        bearing: bearing,
                        duration: 7000
                    });
                    setTimeout(function () {
                        map1.fadeOut(5000);
                    });
                }, 15000);
            });
        });
    }

    function getLocationFromAddress(query, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': query}, function (res, stat) {
            if (stat.toLowerCase() !== 'ok') {
                if (typeof callback === 'function') callback(stat);
                return;
            }

            res = res[0];
            var newCenter = {
                lat: res.geometry.location.lat(),
                lng: res.geometry.location.lng()
            };
            if (typeof callback === 'function') callback(newCenter);
        })
    }

    function getRoomPropDOM(room) {
        if (!room.hasClass('search-room-item')) return;
        return room.find('.search-room-properties');
    }

    function toggleRoom(ev) {
        var target = $(ev.target);
        if (!target.hasClass('search-room-item'))
            target = target.closest('.search-room-item');

        if (target.hasClass('active'))
            collapsRoom(target);
        else
            expandRoom(target);
    }

    function collapsRoom(room) {
        if (!room.hasClass('search-room-item')) return;
        var elem = getRoomPropDOM(room);
        elem.animate({height: 0}, config.roomToggleSpeed, function () {
            room.removeClass('active');
        });
    }

    function expandRoom(room) {
        if (!room.hasClass('search-room-item')) return;
        var rooms = $('.search-room-item');
        rooms.splice(rooms.index(room), 1);
        collapsRoom(rooms);

        var elem = getRoomPropDOM(room);
        if (!elem.length) return console.error('Cannot find room properties element.', room);

        elem.css('height', '');
        var height = elem.height();
        elem.css('height', 0);
        elem.animate({height: height}, config.roomToggleSpeed, function () {
            room.addClass('active');
        });
    }

    function getWeeks(year, month) {
        var startDay = moment([year, month]);
        var fday = moment(startDay).startOf('month');
        var eday = moment(startDay).endOf('month');
        var fweek = fday.week();
        var eweek = eday.week();
        if (eweek < fweek) {
            var edayClone = eday.clone().subtract(1, 'day');
            while (edayClone.week() < fweek) {
                edayClone.subtract(1, 'day');
            }
            eweek = edayClone.week() + 1;
        }

        var weeks = [];
        for (var week = fweek; week <= eweek; week++) {
            weeks.push({
                week: week,
                days: Array(7).fill(0).map(function (n, i) {
                    var date = moment(startDay).week(week).startOf('week').clone().add(n + i, 'day');
                    var day = date.toArray().slice(0, 3);
                    var timestamp = parseInt(date.format('X'));
                    return {date: day, timestamp: timestamp};
                })
            });
        }
        // fday = parseInt(fday.format('D'));
        // eday = parseInt(eday.format('D'));
        // var daysInMonth = startDay.daysInMonth();
        // for(var i = 0; i < daysInMonth; i++) {
        //     var week = {};
        //     week.week = i+1;
        //     week.days = Array(7).fill(0).map(function (n, j) {
        //         var day = moment([year, month, i+1]).toArray();
        //         day.length = 3;
        //         return {date: day};
        //     });
        //     weeks.push(week);
        // }

        return weeks;
    }

    function inRange(date, from, to) {
        if (!date || !from || !to) return false;
        var from = moment(from).format('X');
        var to = moment(to).format('X');
        var date = moment(date).format('X');

        if (date <= to && date >= from) return true;
        return false;
    }

    function validateCheckinDate(date) {
        if (!date) return false;

        // var to = date;
        var now = parseInt(moment().format('X'));
        // var then = parseInt(moment.unix(to).format('X'));
        var diff = date - now;
        var diffHours = diff / 3600;
        return diffHours >= 0;
    }

    function validateCheckoutDate(date) {
        if (!date) return false;
        if (!searchData.checkin) return false;

        // var from = [
        //     searchData.checkin[0],
        //     searchData.checkin[1],
        //     searchData.checkin[2]
        // ];
        // var to = [
        //     date[0],
        //     date[1],
        //     date[2]
        // ];

        // var checkin = parseInt(moment(from).format('X'));
        // var then = parseInt(moment(to).format('X'));
        // var diff = then - checkin;
        var diff = date - searchData.checkin;
        var diffHours = diff / 3600;
        return (diffHours >= 24 && diffHours <= 24 * 30);
        // return (then - checkin) >= (24 * 3600);
    }

    function stayLenght(checkin, checkout) {
        // if(!checkin || !checkout) {
        //     checkin
        // }
    }

    function ttCalendar(year, month) {
        var me = this;
        if (year === undefined) year = moment().year();
        if (month === undefined) month = moment().month();


        updateCal(year, month);
        nextMonthIfNeeded();

        this.updateCal = updateCal;
        this.setMonth = setMonth;
        this.setYear = setYear;
        this.nextMonth = nextMonth;
        this.prevMonth = prevMonth;


        function updateCal(year, month) {
            me.year = year;
            me.month = month;
            me.monthName = moment().month(month).format('MMMM');
            me.weeks = getWeeks(year, month);
        }

        function nextMonthIfNeeded() {
            var arr = [];
            me.weeks.forEach(function (w) {
                w.days.forEach(function (d) {
                    if (d.date[1] !== me.month) return;
                    if (validateCheckinDate(d.timestamp)) arr.push(d);
                });
            });
            if (!arr.length) updateCal(year, month + 1);
        }

        function setMonth(month) {
            if (!month) return;
            updateCal(me.year, month);
        }

        function setYear(year) {
            if (!year) return;
            updateCal(year, me.month);
        }

        function nextMonth() {
            var m = me.month;
            m++;
            if (m > 11) {
                updateCal(me.year + 1, 0);
            } else {
                updateCal(me.year, m);
            }
        }

        function prevMonth() {
            var m = me.month;
            m--;
            if (m < 0) {
                updateCal(me.year - 1, 11);
            } else {
                updateCal(me.year, m);
            }
        }
    }

    function notif() {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();

        if (Notification.permission === 'granted') {
            var title = 'Notification title';
            var options = {
                icon: 'https://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                body: "Click here to redirect to HOTELIAN.COM",
                actions: [
                    {action: 'yes', title: 'Yes'},
                    {action: 'no', title: 'No'}
                ]
            };

            serviceWorkerRegistration.showNotification(title, options);
        }
    }


    // function addRoom() {
    //     if (roomsCount() + 1 > config.maxRooms) return;
    //     var room = {children: []};
    //     addAdult(room);
    //     searchData.rooms.push(room);
    //     if ($scope.user_guid.roomAdded) $scope.user_guid.roomAdded(room);
    // }

    function removeRoom(room) {
        if (!room) return;
        if (searchData.rooms.length < 2) return;
        searchData.rooms.splice(searchData.rooms.indexOf(room), 1);
    }

    function roomsCount() {
        return searchData.rooms.length;
    }

    // function addAdult(room) {
    //     if (!room) return;
    //     if (adultsCount(room) + 1 > config.maxAdultPerRoom) return;
    //     if (!room.adults) room.adults = [];
    //     var adult = {id: adultId++, type: 'adult'};
    //     room.adults.push(adult);
    //     $scope.user_guid.adultAdded(adult);
    // }

    function removeAdult(adult) {
        if (!adult) return;

        searchData.rooms.forEach(function (r) {
            if (r.adults.length < 2) return;
            var i = r.adults.indexOf(adult);
            if (i !== -1) r.adults.splice(i, 1);
        });
    }

    function adultsCount(room) {
        if (!room) {
            var count = 0;
            searchData.rooms.forEach(function (value) {
                count += adultsCount(value);
            });
            return count;
        }
        if (!room.adults) return 0;
        return room.adults.length;
    }

    $scope.childAge = '12';
    $scope.$watch('childAge', function (newVal, oldVal) {
    })


    function addChild(room) {
        if (!room) return;
        if (childrenCount(room) + 1 > config.maxChildrenPerRoom) return;
        if (!room.children) room.children = [];

        var child = {id: childId++, type: 'child', age: $scope.childAge};
        room.children.push(child);
        if (!$scope.user_guid)
            return;
        else {
            if (!getChildAge(child)) removeChild(child);
            else $scope.user_guid.childAdded(child);
        }
    }

    function childrenCount(room) {
        if (!room) {
            var count = 0;
            searchData.rooms.forEach(function (value) {
                count += childrenCount(value);
            });
            return count;
        }

        if (!room.children) return 0;
        return room.children.length;
    }

    function getChildAge(roomID, childID) {
        var age;
        if (typeof roomID !== "undefined" && typeof childID !== 'undefined') {
            var id = '#child_age_' + roomID + '_' + childID;
            var $element = $(id);
            if ($element.length) {
                age = $element.find('option:selected').val();
                $scope.searchData.rooms[roomID].children[childID].age = age;
            }
        }
        return true;
    }

    // function getChild(id) {
    //     for (var i = 0; i < searchData.rooms.length; i++) {
    //         var child = null;
    //         var room = searchData.rooms[i];
    //         room.children.forEach(function (ch) {
    //             if (ch.id === id) child = ch;
    //         });
    //         if (child !== null) return child;
    //     }
    //     return false;
    // }

    function removeChild(child, roomID) {
        if (!child) return;

        // remvoe last element
        if (searchData.rooms[roomID] && searchData.rooms[roomID].children.length) {
            searchData.rooms[roomID].children.pop();
        }

        //remove select element from dom
        var selector = '[id^=child_age_' + roomID + '_]';
        var elements = $(selector);
        if (elements.length > 0) {
            elements[elements.length - 1].remove();
        }
    }


    //=======================================
    // Keyboard Navigation in autocomplete
    //=======================================
    if ($scope.searchFormType === 'inline') {
        var liSelected;
        var ulSelected;
        $('input').focus(function (e) {
            liSelected = false;
            ulSelected = '';
        });
        $(window).on('keydown', function (e) {
            var lis = [];
            var ul;
            //check while list is open
            if ($('#destinations').length) {
                lis = $('#destinations li');
                ul = $('#destinations');
                ulSelected = 'destinations';
            } else if ($('#nationalities').length) {
                lis = $('#nationalities li');
                ul = $('#nationalities');
                ulSelected = 'nationalities';
            }
            if (lis.length) {
                var scrollTop = ul.scrollTop();
                var ulHeight = ul.outerHeight();

                //down arrow
                if (e.which === 40) {
                    if (liSelected) {
                        liSelected.removeClass('c-liHover');
                        next = liSelected.next();
                        if (next.length > 0) {
                            liSelected = next.addClass('c-liHover');
                            if (Math.floor(liSelected.position().top + liSelected.outerHeight()) > ulHeight) {
                                ul.scrollTop(scrollTop + liSelected.outerHeight());
                            }
                        }
                        //last li in list
                        else {
                            liSelected = lis.eq(0).addClass('c-liHover');
                            ul.scrollTop(0);
                        }
                    } else {
                        liSelected = lis.eq(0).addClass('c-liHover');
                    }
                }

                //up arrow
                else if (e.which === 38) {
                    if (liSelected) {
                        liSelected.removeClass('c-liHover');
                        const next = liSelected.prev();
                        if (next.length > 0) {
                            liSelected = next.addClass('c-liHover');
                            if (liSelected.offset().top < ul.offset().top) {
                                ul.scrollTop(scrollTop - liSelected.outerHeight());
                            }
                        }
                        //first li in list
                        else {
                            ul.scrollTop(ulHeight + liSelected.outerHeight());
                            liSelected = lis.last().addClass('c-liHover');
                        }
                    } else {
                        liSelected = lis.last().addClass('c-liHover');
                        ul.scrollTop(ulHeight + liSelected.outerHeight());
                    }
                }

                //enter key press
                else if (e.which === 13 && liSelected) {
                    if (ulSelected === 'destinations') {
                        $('#destination-autocomplete').blur();
                        if (liSelected.data('citycode') && liSelected.data('citycode') && liSelected.data('citycode')) {
                            $scope.selectDestination({
                                CityCode: liSelected.data('citycode'),
                                CityName: liSelected.data('cityname'),
                                CountryCode: liSelected.data('countryname')
                            });
                            $scope.$apply();
                        }
                    } else if (ulSelected === 'nationalities') {
                        $('#nationality-autocomplete').blur();
                        if (liSelected.data('countrycode') && liSelected.data('countryname')) {
                            $scope.selectNationality({
                                CountryCode: liSelected.data('countrycode'),
                                CountryName: liSelected.data('countryname'),
                            });
                            $scope.$apply();
                        }
                    }
                }
            }
        });
    }

}]);
function adjustPOIPosition() {
    //this method hold background image in middle of search box by negative margin
    var $searchForm = $('form#searchForm');
    var $pointOfInterest = $('.c-pointOfInterest--wrapper');
    if ($searchForm.length && $pointOfInterest.length) {
        var searchFormHeighh = $searchForm.outerHeight();
        $pointOfInterest.css({marginTop: ((-1) * searchFormHeighh / 2)});
    }
}
export default Search;