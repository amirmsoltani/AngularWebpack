<!doctype html>
<html lang="en" ng-cloak ng-app="Search">
<head>
    <title>Hotel Search</title>
    <?php include 'includes/htl_d_head.php' ?>
</head>
<body class="d-flex flex-column no-transition bg-pattern" ng-controller="SearchCtrl">
<header class="nav-container">
    <?php include 'includes/htl_d_navbar.php' ?>
</header>
<div class="w-100 h-100 position-static date-picker" ng-show="searchData.show" >
    <date-picker first="searchData.mCheckin"
                 end="searchData.mCheckout"
                 agent="'desktop'"
                 on-select="searchData.func(first,end)"
                 fit="#checkin-checkout-datepicker"
                 title="'test'"
    />
</div>
<main class="d-flex flex-grow-1" ng-mousedown="searchData.show = false;">
    <div class="c-search--page d-flex flex-column position-relative">

        <!-- search form -->
        <div class="c-searchForm--wrapper mt-5 px-2 px-md-3 px-xl-5">

            <!-- header -->
            <div class="c-searchForm--header text-center d-flex flex-column text-black ">
                <span class="bold text-large-x">you looking for the best price and best support?</span>
                <span class="text-large">
                    <span>save your money, relax, and choose</span>
                    <span class="text-primary bold">Hotelian<span class="text-important bold">.com</span></span>
                </span>
            </div>

            <!-- form -->
            <form autocomplete="off" name="searchForm" id="searchForm" >
                <div class="container px-1 mt-5 round-less bg-important d-flex flex-wrap">

                    <!-- destination -->
                    <div class="col-12 col-md-6 col-lg-4 col-xl-2 px-1 position-relative"
                         click-outside="showCities = false" is-active="showCities">
                        <div class="c-searchForm--input--container p-0 my-2 round-less">
                            <label class="text-muted col-12 p-2 mb-0 h-100 position-relative" id="destSearchLabel"
                                   for="destination-autocomplete">
                                <span class="c-noselect c-no-pointer-event">
                                    <i class="fa fa-map-marker-alt"></i>
                                    <span>Destination</span>
                                </span>
                                <input name="to" id="destination-autocomplete"
                                       class="form-control text-dark c-searchForm--input"
                                       type="text" ng-focus="showCities = true"
                                       ng-model="destSearch" ng-model-options="{debounce: 300}" required>
                            </label>
                            <div class="c-autocomplete--dropdown__destination no-transition position-absolute">
                                <ul class="m-0 p-0" id="destinations" ng-if="showCities">
                                    <li class="d-flex" ng-repeat="city in cities"
                                        data-citycode="{{city.CityCode}}" data-cityname="{{city.CityName}}"
                                        data-countryName="{{city.CountryCode}}" ng-click="selectDestination(city)">
                                        <img src="/img/flags/16/{{city.CountryCode}}.png" class="mr-2" height="18"
                                             alt="{{city.CountryCode}}_flag">
                                        <span>
                                            <span>{{city.CityName}}, {{city.CountryCode}}</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- nationality -->
                    <div class="col-12 col-md-6 col-lg-3 col-xl-2 px-1" click-outside="showNations= false"
                         is-active="showNations">
                        <div class="c-searchForm--input--container p-0 my-2 round-less">
                            <label class="text-muted col-12 p-2 mb-0 h-100 position-relative" id="nationSearchLabel"
                                   for="nationality-autocomplete">
                                <span class="c-noselect c-no-pointer-event">
                                    <i class="fa fa-flag"></i>
                                    <span>Nationality</span>
                                </span>
                                <input id="nationality-autocomplete" name="nationality"
                                       class="form-control c-searchForm--input text-dark" type="text"
                                       ng-model="natioSearch"
                                       ng-model-options="{debounce: 300}" required ng-focus="showNations = true">
                            </label>
                            <div class="c-autocomplete--dropdown__nationality position-absolute">
                                <ul class="m-0 p-0" id="nationalities" ng-if="showNations">
                                    <li class="d-flex" ng-repeat="nation in nationalities"
                                        data-countrycode="{{nation.CountryCode}}"
                                        data-countryname="{{nation.CountryName}}" ng-click="selectNationality(nation)">
                                        <span>
                                            <span class="p-1 bg-light border rounded">{{nation.CountryCode}}</span>
                                            <span class="ml-1">{{nation.CountryName}}</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- check in-out -->
                    <div class="col-12 col-md-6 col-lg-5 col-xl-3 px-1">

                        <div class="c-searchForm--input--container p-0 my-2 round-less">
                            <label class="text-muted col-12 p-2 mb-0 h-100" for="i-check-in-out">

                            <span class="c-noselect c-no-pointer-event">
                                <i class="fa fa-calendar-alt"></i>
                                <span>Check in</span>
                                 <i class="fal fa-long-arrow-right mx-2"></i>
                                 <i class="fa fa-calendar-check"></i>
                                <span>Check out</span>
                            </span>
                                <input type="hidden" name="checkin" ng-model="searchData.checkin" required>
                                <input type="hidden" name="checkout" ng-model="searchData.checkout" required>
                                <input id="checkin-checkout-datepicker" name="checkin-checkout-datepicker"
                                       class="form-control c-searchForm--input text-dark" type="text"
                                       ng-value="searchData.checkin+' - '+searchData.checkout"
                                       ng-mouseup="searchData.show = true;"
                                />
                            </label>
                        </div>

                    </div>
                    <!-- rooms and guests -->
                    <div class="col-12 col-md-6 col-lg-7 col-xl-3 px-1">

                        <div class="c-searchForm--input--container p-0 my-2 round-less">
                            <label class="text-muted col-12 p-2 mb-0 h-100" for="rooms-summary">
                                <span class="c-noselect c-no-pointer-event">
                                    <i class="fa fa-bed"></i>
                                    <span>Rooms and Guests</span>
                                </span><br>
                                <button type="button" class="col-12 text-left pl-0 text-dark btn btn-transparent"
                                        id="rooms-summary">
                                    <span>{{searchData.rooms.length}} Room</span>
                                    <span class="mx-1">/</span>
                                    <span>{{adultsCount()}} Adult</span>
                                    <span ng-if="childrenCount()" class="mx-1">/</span>
                                    <span ng-if="childrenCount()">{{childrenCount()}} Child</span>
                                </button>
                            </label>
                        </div>
                    </div>

                    <!-- search btn -->
                    <div class="d-flex col-12 col-md-12 col-lg-5 col-xl-2 px-1">
                        <div class="col-12 c-searchForm--submit--container d-flex my-2 round-less">
                            <button class="col-12 btn btn-primary round-less position-relative" type="submit"
                                    id="searchFormSubmit">
                                <i class="fas fa-search fa-2x mr-2"></i>
                                <span class="bold text-large">SEARCH</span>
                            </button>
                        </div>
                    </div>

                </div>
            </form>

        </div>

        <!-- background -->
        <div class="c-pointOfInterest--wrapper flex-grow-1 d-flex justify-content-between"
             style='background: var(--primary) url("/img/backgrounds/Great Temple,Petra, Jordan_1_187083.jpg") center no-repeat;background-size: cover'>
            <div class="c-pointOfInterest--info col-12 d-flex justify-content-center justify-content-md-between flex-wrap">
                <!-- info -->
                <div class="col-12 col-md-auto my-2 my-md-0 text-white d-flex align-items-center justify-content-center c-noselect mx-1 mx-md-0">
                    <!-- marker -->
                    <div class="mx-3">
                        <img src="/img/location.svg" width="60" alt="">
                    </div>
                    <!-- details -->
                    <div class="d-flex flex-md-column flex-wrap mx-3">
                        <!-- location name -->
                        <span class="text-large mx-1 mx-md-0">Great Temple,</span>
                        <!-- city name -->
                        <span class="text-large mx-1 mx-md-0">Petra,</span>
                        <!-- country name -->
                        <span class="text-large-x mx-1 mx-md-0 bold">Jordan</span>
                    </div>
                </div>
                <!-- buttons -->
                <div class="col-12 col-md-auto my-2 my-md-0 justify-content-center c-pointOfInterest--buttons d-flex align-items-center">
                    <a href="#" class="btn btn-primary mx-2 cursor-pointer text-white">View full size image</a>
                    <a href="#" class="btn btn-white mx-2 cursor-pointer">View hotels</a>
                </div>
            </div>
        </div>

        <!-- room selector -->
        <div class="c-room-selector--wrapper no-transition" id="i-roomSelector">
            <div class="d-flex flex-column col-9 col-md-8 col-lg-6 col-xl-5 px-0 mx-auto shadow c-room-selector--container">

                <div class="col-12">
                    <div class="col-12 pt-5 d-flex flex-column">

                        <!-- rooms -->
                        <div class="d-flex flex-column my-3"
                             ng-repeat="room in searchData.rooms track by $index">

                            <!-- room label -->
                            <div class="p-0 c-room-selector--room-label d-flex align-items-center justify-content-between">
                                <div class="bold px-3">
                                    <span>Room</span>
                                    <span>#{{$index+1}}</span>
                                </div>
                                <button type="button" title="Remove this room"
                                        class="btn btn-default text-important btn-sm rounded-0"
                                        ng-click="removeRoom(room)" ng-show="searchData.rooms.length > 1">
                                    <i class="fal fa-times"></i>
                                </button>
                            </div>

                            <!-- room guests -->
                            <div class="c-room-selector--room-body d-flex flex-wrap justify-content-center justify-content-md-start px-0">

                                <!-- number of guests -->
                                <div class="col-12 col-md-6 col-lg-5 col-xl-4 pr-0 d-flex flex-wrap justify-content-between">

                                    <!-- adults -->
                                    <div class="c-room-selector--count-container">
                                        <div class="d-flex flex-column">
                                            <div class="text-center text-black mb-2 pb-1">
                                                <span class="bold text-normal">Adults</span>
                                            </div>
                                            <div class="d-flex">
                                                <div class="my-auto">
                                                    <button type="button"
                                                            class="btn btn-sm btn-primary text-white c-room-selector--count-buttons"
                                                            ng-disabled="room.adults.length <= 1"
                                                            ng-click="removeAdult(room.adults[0])">
                                                        <small class="fal fa-chevron-down"></small>
                                                    </button>
                                                </div>
                                                <span class="text-large px-3 text-dark">{{room.adults.length}}</span>
                                                <div class="my-auto">
                                                    <button type="button" ng-click="addAdult(room)"
                                                            class="btn btn-sm btn-primary text-white c-room-selector--count-buttons"
                                                            ng-disabled="(room.adults.length >= config.maxAdultPerRoom) || (room.children.length+room.adults.length) >=config.maxGuestPerRoom">
                                                        <small class="fal fa-chevron-up"></small>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- children -->
                                    <div class="c-room-selector--count-container">
                                        <div class="d-flex flex-column">
                                            <div class="text-center text-black mb-2 pb-1">
                                                <span class="bold text-normal">Children</span>
                                            </div>
                                            <div class="d-flex">
                                                <div class="my-auto">
                                                    <button class="btn btn-sm btn-primary text-white c-room-selector--count-buttons"
                                                            type="button" ng-disabled="room.children.length < 1"
                                                            ng-click="removeChild(room,$index)">
                                                        <small class="fal fa-chevron-down"></small>
                                                    </button>
                                                </div>
                                                <span class="text-large px-3 text-dark">{{room.children.length}}</span>
                                                <div class="my-auto">
                                                    <button class="btn btn-sm btn-primary text-white c-room-selector--count-buttons"
                                                            type="button" ng-click="addChild(room)"
                                                            ng-disabled="(room.children.length >= config.maxChildrenPerRoom) || (room.children.length+room.adults.length) >=config.maxGuestPerRoom">
                                                        <small class="fal fa-chevron-up"></small>
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <!-- age of guests -->
                                <div class="col-12 col-md-6 col-lg-7 col-xl-8 d-flex my-4 my-md-0 pr-0">
                                    <div class="d-flex flex-column col-12 px-0">
                                        <div class="text-left text-black pl-3 mb-2"
                                             ng-show="room.children.length">
                                            <span class="text-normal bold">How old are children you're traveling with?</span>
                                        </div>
                                        <div class="d-flex flex-wrap">
                                            <div class="col-12 col-lg-6 col-xl-4 justify-content-center justify-content-md-around mb-2"
                                                 ng-repeat="child in room.children track by $index">
                                                <select class="form-control" ng-model="childAge"
                                                        id="child_age_{{$parent.$index}}_{{$index}}"
                                                        ng-change="getChildAge($parent.$index,$index,room)">
                                                    <option value="1">1 <small>years old</small></option>
                                                    <option value="2">2 years old</option>
                                                    <option value="3">3 years old</option>
                                                    <option value="4">4 years old</option>
                                                    <option value="5">5 years old</option>
                                                    <option value="6">6 years old</option>
                                                    <option value="7">7 years old</option>
                                                    <option value="8">8 years old</option>
                                                    <option value="9">9 years old</option>
                                                    <option value="10">10 years old</option>
                                                    <option value="11">11 years old</option>
                                                    <option value="12" selected>12 years old</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- add rooms -->
                        <button type="button"
                                class="btn btn-transparent my-4 py-4 text-primary text-center cursor-pointer"
                                ng-show="searchData.rooms.length < config.maxRooms" ng-click="addRoom()">
                            <div class="d-flex flex-column">
                                <i class="fas fa-plus fa-lg my-1"></i>
                                <span class="bold text-large my-1">Add Room</span>
                            </div>
                        </button>

                    </div>
                </div>

                <!-- save -->
                <div class="col-12 px-0 d-flex justify-content-end">
                    <button class="bg-important border-0 py-2 px-5 text-white cursor-pointer" type="button"
                            id="i-saveGuestsArrange">
                        Add Guest
                    </button>
                </div>
            </div>

        </div>

    </div>
</main>
<footer>
</footer>
<?php //include 'includes/htl_d_script.php' ?>
<script>
    // $(document).ready(function () {
    //     adjustPOIPosition();
    //     var myTimer;
    //     $(window).resize(function () {
    //         clearTimeout(myTimer);
    //         myTimer = setTimeout(function () {
    //             adjustPOIPosition();
    //         }, 500)
    //     });
    // })

</script>
</body>
</html>