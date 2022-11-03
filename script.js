//page element declarations
const searchField = document.getElementsByClassName('areaInput')[0];



const searchButton = document.getElementsByClassName('submitArea')[0];

const infoContainer = document.getElementsByClassName('infoContainer')[0];
const infoElement = document.getElementsByClassName('info');

const background = document.getElementsByClassName('backgroundContainer')[0];
const pageContainer = document.getElementsByClassName('pageContainer')[0];

const menu = document.getElementsByClassName('menuText')[0];
const themeMenu = document.getElementsByClassName('themeMenu')[0];
const themeNotch = document.getElementsByClassName('themeNotch')[0];

const menuOptions = document.getElementsByClassName('themeOptions')[0];
const classic = document.getElementsByClassName('classic')[0];
const light = document.getElementsByClassName('light')[0];

const areaName = document.getElementsByClassName('areaName')[0];
const country = document.getElementsByClassName('countryName')[0];
const searchPrompt = document.getElementsByClassName('searchPrompt')[0];
const areaInfo = document.getElementsByClassName('areaInfo')[0];
const title = document.getElementsByClassName('title')[0];

const copyright = document.getElementsByClassName('copyright')[0];

searchField.focus();

let theme = 0;

var searchFieldText = '';

//openweathermap api key and url
const apiKey = "a702a24de613c22e332622b50e949990";
const apiUrl = (location) => `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

//weather object fetch from url with 'location'
async function getWeather(location) {
    const resp = await fetch(apiUrl(location), {
        origin: 'no-cors'});
    
    const respData = await resp.json();

    console.log(respData);
    pasteWeather(respData)
}
//kelvin to celsius converter
function KtoC(K) {
    return K - 273.15;
};


//paste Weather from weather object
function pasteWeather(data) {
    //element selectors
    title.classList.add('fade');
    setTimeout(() => {
        title.style.display = 'none';
    }, 500);
    //location info
    const city = data.name;
    let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const countryCode = data.sys.country;
    // const countryName = countryCodeToName(countryCode);
    const countryName = regionNames.of(`${countryCode}`);
    console.log(countryName);
    console.log(countryCode);
    //local time
    let clock = '';
    //weather info objects
    const temp = {
        data: (KtoC(data.main.temp)).toFixed(1) + 'c',
        desc: 'Temperature',
        number: 0
    }

    const feelsLike = {
        data: (KtoC(data.main.feels_like)).toFixed(1) + 'c',
        desc: 'Feels Like',
        number: 1
    }

    const humidity = {
        data: data.main.humidity + '%',
        desc: 'Humidity',
        number: 0
    }

    const pressure = {
        data: data.main.pressure + ' hPa',
        desc: 'Pressure',
        number: 1
    }

    const weatherState = {
        data: data.weather[0].main,
        desc: 'Description',
        number: 0
    }

    const weatherStateType = {
        data: formatWeatherType(data.weather[0].description),
        desc: 'Type',
        number: 1
    }

    const windSpeed = {
        data: (data.wind.speed * 2.237).toFixed(1) + ' Mph',
        desc: 'Wind Speed',
        number: 1
    }

    const windDirection = {
        data: data.wind.deg + '°',
        desc: 'Wind Direction',
        number: 1
    }

    const sunriseStandard = {
        data: UnixToStandard(data.sys.sunrise, data.timezone),
        desc: 'Sunrise',
        number: 0
    }

    const sunsetStandard = {
        data: UnixToStandard(data.sys.sunset, data.timezone),
        desc: 'Sunset',
        number: 0
    }

    //infoset array
    const infoSet = [temp, feelsLike, humidity, pressure, weatherState, weatherStateType, windSpeed, windDirection, sunriseStandard, sunsetStandard];
   //search location fade animaton + page container rise animation
   searchPrompt.classList.add('fade');
   searchPrompt.addEventListener('transitionend', () => {
    searchPrompt.style.display = 'none';
    console.log('done')
   })
        pageContainer.style.marginTop = '20px';
        // shows weather container
        infoContainer.style.display = 'flex';
        //writes location and time info to dom
        // areaName.innerHTML = `${city.toUpperCase()}`
        // country.innerHTML = `${countryName.toUpperCase()}`
        // function fetchTime() {
        //     localTime(data.timezone, sunriseStandard.data, sunsetStandard.data);
        // }
        // clock = setInterval(fetchTime, 1000);
        //clears info elements from previous search before creating new;
        if (infoElement[0].innerHTML != '') {
            infoContainer.classList.add('swipe');
            areaInfo.classList.add('fade');
        } 
        setTimeout(() => {
            infoContainer.classList.remove('swipe');
            infoContainer.classList.add('swipeRight');
        }, 250);

        setTimeout(() => {
            areaName.innerHTML = `${city.toUpperCase()}`
            country.innerHTML = `${countryName.toUpperCase()}`
            function fetchTime() {
            localTime(data.timezone, sunriseStandard.data, sunsetStandard.data);
            }
            fetchTime()
            clock = setInterval(fetchTime, 1000);
            infoElement[0].innerHTML = '';
            infoElement[1].innerHTML = '';
            //creates info element for each 'infoSet' object
            for (let i = 0; i < infoSet.length; i++) {
            createElement(infoSet[i].data, infoSet[i].desc, infoSet[i].number);
            }
            //changes background image according to weather condition
            background.innerHTML = `<img src='images/${data.weather[0].main}.jpg'>`
            //clears previous clock when new search performed
            searchButton.addEventListener('click', () => {
                clearInterval(clock);
            })
            infoContainer.classList.remove('swipeRight');
            areaInfo.classList.remove('fade');
            if (theme === 1) {
                monoTheme()
                console.log('Theme: Mono');
                menuOptions.classList.toggle('show');
            } else {
                classicTheme()
                console.log('Theme: Classic')
                menuOptions.classList.toggle('show');
            }
        }, 500);
            
}
//function called by search button that calls getWeather with 'location' value of searchField
function searchWeather() {
    const area = searchField.value;
    searchFieldText = area;
    getWeather(`${area}`);
}
//unix timestamp to standard time format function
function UnixToStandard(unixTime, timeoffset) {
    let unix = unixTime * 1000;
    let timeDiff = timeoffset * 1000;
    var date = new Date(unix + timeDiff);
    var hours;
    if ((date.getHours() -1) < 0) {
     hours = "0" + (date.getHours() + 23)
    } else {
    var hours = "0" + (date.getHours() -1);
    }
    var minutes = "0" + date.getMinutes();
    var formattedTime = hours.substr(-2) + ':' + minutes.substr(-2);
    return formattedTime
}
//time display + light/dark mode toggler
function localTime(timeoffset, sunrise, sunset) {
    let timeDiff = timeoffset * 1000;
    var date = new Date();
    console.log(date.getTime())
    unix = date.getTime();
    unix -= 3600000;
    var localDate = new Date(unix + timeDiff);
    hours = '0' + localDate.getHours();
    minutes = '0' + localDate.getMinutes();
    seconds = '0' + localDate.getSeconds();
    local = `${hours.substr(-2)}:${minutes.substr(-2)}:<div class='seconds'>${seconds.substr(-2)}</div>`
    const timeDisplay = document.getElementsByClassName('localTime')[0];
    timeDisplay.innerHTML = `Local Time: <h3 class='time'>${local}</h3>`
    //--------------------------- dark mode----------------------
    const body = document.querySelector('body');
    const background = document.getElementsByClassName('backgroundContainer')[0];
    let sunsetString = sunset.split(':');
    let sunriseString = sunrise.split(':');
    let timeString = local.split(':');

    let timeNumber = timeString[0] + timeString[1];
    let sunsetNumber = sunsetString[0] + sunsetString [1];
    let sunriseNumber = sunriseString[0] + sunriseString [1];

    if (timeNumber >= sunsetNumber || timeNumber <= sunriseNumber) {
        body.style.backgroundColor = 'black';
        background.style.opacity = '0.1';
        console.log('Night Mode');
        areaInfo.style.color = 'white';
        menu.style.color = 'rgba(255,255,255,1)';
        menuOptions.style.color = 'rgba(255,255,255,1)';
    } else {
        body.style.backgroundColor = '#20C9E6';
        background.style.opacity = '0.5';
        console.log('Day Mode');
    }
}

//converts 2 letter country code to country name
function countryCodeToName(code) {
    const countryList = {
    AF: 'Afghanistan',
    AL: 'Albania',
    DZ: 'Algeria',
    AS: 'American Samoa',
    AD: 'Andorra',
    AO: 'Angola',
    AI: 'Anguilla',
    AQ: 'Antarctica',
    AG: 'Antigua and Barbuda',
    AR: 'Argentina',
    AM: 'Armenia',
    AW: 'Aruba',
    AU: 'Australia',
    AT: 'Austria',
    AZ: 'Azerbaijan',
    BS: 'Bahamas',
    BH: 'Bahrain',
    BD: 'Bangladesh',
    BB: 'Barbados',
    BY: 'Belarus',
    BE: 'Belgium',
    BZ: 'Belize',
    BJ: 'Benin',
    BM: 'Bermuda',
    BT: 'Butan',
    BO: 'Bolivia',
    BQ: 'Bonaire, Sint Eustatius and Saba',
    BA: 'Bosnia and Herzegovina', 
    BW: 'Botswana',
    BV: 'Bouvet Island',
    BR: 'Brazil',
    IO: 'British Indian Ocean Territory',
    BN: 'Brunei Darussalam',
    BG: 'Bulgaria',
    BF: 'Burkina Faso',
    BI: 'Burundi',
    CV: 'Cabo Verde',
    KH: 'Cambodia',
    CM: 'Cameroon',
    CA: 'Canada',
    KY: 'Cayman Islands',
    CF: 'Central African Republic',
    TD: 'Chad',
    CL: 'Chile',
    CN: 'China',
    CX: 'Christmas Island',
    CC: 'Cocos (Keeling) Islands',
    CO: 'Colombia',
    KM: 'Comoros',
    CD: 'Democratic Republic of the Congo',
    CG: 'Congo',
    CK: 'Cook Islands',
    CR: 'Costa Rica',
    HR: 'Croatia',
    CU: 'Cuba',
    CW: 'Curaçao',
    CY: 'Cyprus',
    CZ: 'Czechia',
    CI: `Côte d'Ivoire`,
    DK: 'Denmark',
    DJ: 'Djibouti',
    DM: 'Dominica',
    DO: 'Dominican Republic',
    EC: 'Ecuador',
    EG: 'Egypt',
    SV: 'El Salvador',
    GQ: 'Equatorial Guinea',
    ER: 'Eritrea',
    EE: 'Estonia',
    SZ: 'Eswatini',
    ET: 'Ethiopia',
    FK: 'Falkland Islands',
    FO: 'Faroe Islands',
    FJ: 'Fiji',
    FI: 'Finland',
    FR: 'France',
    GF: 'French Guiana',
    PF: 'French Polynesia',
    TF: 'French Southern Territories',
    GA: 'Gabon',
    GM: 'Gambia (the)',
    GE: 'Georgia',
    DE: 'Germany',
    GH: 'Ghana',
    GI: 'Gibraltar',
    GR: 'Greece',
    GL: 'Greenland',
    GD: 'Grenada',
    GP: 'Guadeloupe',
    GU: 'Guam',
    GT: 'Guatemala',
    GG: 'Guernsey',
    GN: 'Guinea',
    GW: 'Guinea-Bissau',
    GY: 'Guyana',
    HT: 'Haiti',
    HM: 'Heard Island and McDonald Islands',
    VA: 'Holy See',
    HN: 'Honduras',
    HK: 'Hong Kong',
    HU: 'Hungary',
    IS: 'Iceland',
    IN: 'India',
    ID: 'Indonesia',
    IR: 'Iran',
    IQ: 'Iraq',
    IE: 'Ireland',
    IM: 'Isle of Man',
    IL: 'Israel',
    IT: 'Italy',
    JM: 'Jamaica',
    JP: 'Japan',
    JE: 'Jersey',
    JO: 'Jordan',
    KZ: 'Kazakhstan',
    KE: 'Kenya',
    KI: 'Kiribati',
    KP: `Korea (the Democratic People's Republic of)`,
    KR: 'Korea (the Republic of)',
    KW: 'Kuwait',
    KG: 'Kyrgyzstan',
    LA: `Lao People's Democratic Republic`,
    LV: 'Latvia',
    LB: 'Lebanon',
    LS: 'Lesotho',
    LR: 'Liberia',
    LY: 'Libya',
    LI: 'Liechtenstein',
    LT: 'Lithuania',
    LU: 'Luxembourg',
    MO: 'Macao',
    MG: 'Madagascar',
    MW: 'Malawi',
    MY: 'Malaysia',
    MV: 'Maldives',
    ML: 'Mali',
    MT: 'Malta',
    MH: 'Marshall Islands',
    MQ: 'Martinique',
    MR: 'Mauritania',
    MU: 'Mauritius',
    YT: 'Mayotte',
    MX: 'Mexico',
    FM: 'Micronesia',
    MD: 'Moldova',
    MC: 'Monaco',
    MN: 'Mongolia',
    ME: 'Montenegro',
    MS: 'Montserrat',
    MA: 'Morocco',
    MZ: 'Mozambique',
    MM: 'Myanmar',
    NA: 'Namibia',
    NR: 'Nauru',
    NP: 'Nepal',
    NL: 'Netherlands',
    NC: 'New Caledonia',
    NZ: 'New Zealand',
    NI: 'Nicaragua',
    NE: 'Niger',
    NG: 'Nigeria',
    NU: 'Niue',
    NF: 'Norfolk Island',
    MP: 'Northern Mariana Islands',
    NO: 'Norway',
    OM: 'Oman',
    PK: 'Pakistan',
    PW: 'Palau',
    PS: 'Palestine',
    PA: 'Panama',
    PG: 'Papua New Guinea',
    PY: 'Paraguay',
    PE: 'Peru',
    PH: 'Philippines',
    PN: 'Pitcairn',
    PL: 'Poland',
    PT: 'Portugal',
    PR: 'Puerto Rico',
    QA: 'Qatar',
    MK: 'Republic of North Macedonia',
    RO: 'Romania',
    RU: 'Russia',
    RW: 'Rwanda',
    RE: 'Réunion',
    BL: 'Saint Barthélemy',
    SH: 'Saint Helena',
    KN: 'Saint Kitts and Nevis',
    LC: 'Saint Lucia',
    MF: 'Saint Martin',
    PM: 'Saint Pierre and Miquelon',
    VC: 'Saint Vincent and Grenadines',
    WS: 'Samoa',
    SM: 'San Marino',
    ST: 'Sao Tome and Principe',
    SA: 'Saudi Arabia',
    SN: 'Senegal',
    RS: 'Serbia',
    SC: 'Seychelles',
    SL: 'Sierra Leone',
    SG: 'Singapore',
    SX: 'Sint Maarten',
    SK: 'Slovakia',
    SI: 'Slovenia',
    SB: 'Solomon Islands',
    SO: 'Somalia',
    ZA: 'South Africa',
    GS: 'South Georgia, South Sandwich Islands',
    SS: 'South Sudan',
    ES: 'Spain',
    LK: 'Sri Lanka',
    SD: 'Sudan',
    SR: 'Suriname',
    SJ: 'Svalbard and Jan Mayen',
    SE: 'Sweden',
    CH: 'Switzerland',
    SY: 'Syrian Arab Republic',
    TW: 'Taiwan',
    TJ: 'Tajikistan',
    TZ: 'Tanzania',
    TH: 'Thailand',
    TL: 'Timor-Leste',
    TG: 'Togo',
    TK: 'Tokelau',
    TO: 'Tonga',
    TT: 'Trinidad and Tobago',
    TN: 'Tunisia',
    TR: 'Turkey',
    TM: 'Turkmenistan',
    TC: 'Turks and Caicos Islands',
    TV: 'Tuvalu',
    UG: 'Uganda',
    UA: 'Ukraine',
    AE: 'United Arab Emirates',
    GB: 'United Kingdom ',
    UM: 'United States Minor Outlying Islands',
    US: 'United States of America ',
    UY: 'Uruguay',
    UZ: 'Uzbekistan',
    VU: 'Vanuatu',
    VE: 'Venezuela',
    VN: 'Viet Nam',
    VG: 'Virgin Islands (British)',
    VI: 'Virgin Islands (U.S.)',
    WF: 'Wallis and Futuna',
    EH: 'Western Sahara',
    YE: 'Yemen',
    ZM: 'Zambia',
    ZW: 'Zimbabwe',
    AX: 'Åland Islands'
    }
    const countryName = countryList[code];
    return countryName;
}

//form search button listener
searchButton.addEventListener('click', () => {
    if (searchField.value !== 'enter a location' && searchField.value !== '') {
        searchWeather();
    }
})

//search field listener to clear previous text when clicked
searchField.addEventListener('click', () => {
    if (searchField.value === searchFieldText) {
        searchField.value = '';
    }
})

//theme menu buttons
menu.addEventListener('click', () => {
    menuOptions.classList.toggle('show');
})
//classic theme button
classic.addEventListener('click', () => {
theme = 0;
classicTheme();
})
//light theme button
light.addEventListener('click', () => {
    theme = 1;
    monoTheme();
})

//element create function, takes 2 properties from an infoset object
function createElement (data, type, number) {
    if (type === 'Temperature' || type === 'Feels Like') {
        let tempState;
        let tempRaw = data.split('.');
        if (tempRaw[0] > 25) {
            //hot
            tempState = 'hot'
        } else if (tempRaw[0] > 14) {
            //avg
            tempState = 'med'
        } else if (tempRaw[0] > -5) {
            //cold
            tempState = 'cold'
        }
        const format = `<h4 class='type'>${type}:</h4><h4 class='data'><div class='${tempState}'>${data.split('c')[0]}</div>${data.slice(4)}</h4>`;
        const label = document.createElement('h4');
        infoElement[number].appendChild(label);
        label.innerHTML = format;
        label.classList.add('label');
    } else if (type === 'Wind Direction') { 
        const format = `<h4 class='type'>${type}:</h4><h4 class='data'>${data}</h4><i class="fas fa-long-arrow-alt-up" id='arrow'></i>`;
        const label = document.createElement('h4');
        infoElement[number].appendChild(label);
        label.innerHTML = format;
        label.classList.add('label');
        const arrow = document.getElementById('arrow');
        arrow.style.transform = `rotate(${data.split('°')[0]}deg)`;
    } else {
    const format = `<h4 class='type'>${type}:</h4><h4 class='data'>${data}</h4>`;
    const label = document.createElement('h4');
    infoElement[number].appendChild(label);
    label.innerHTML = format;
    label.classList.add('label');
    }
}

function formatWeatherType(data) {
   let string = data.split(' ');
   console.log(string)
   if ((string.length) > 1) {
    let firstWord = string[0].charAt(0).toUpperCase() + string[0].slice(1);
    let secondWord = string[1].charAt(0).toUpperCase() + string[1].slice(1);
    let formatted = `${firstWord} ${secondWord}`;
    return formatted;
   } else {
    let firstWord = string[0].charAt(0).toUpperCase() + string[0].slice(1);
    let formatted = `${firstWord}`;
    return formatted;
   }

}
//mono theme function
function monoTheme() {
    const tag = document.querySelectorAll('h4');
    const areaInfo = document.getElementsByClassName('areaInfo')[0];
    infoContainer.style.backgroundColor = 'rgba(255,255,255,.7)'
    menuOptions.classList.toggle('show');
    infoElement[0].style.backgroundColor = 'black';
    infoElement[1].style.backgroundColor = 'black';
    for (i = 0; i < tag.length; i++) {
        tag[i].style.backgroundColor = 'white';
        tag[i].style.color = 'black';
        tag[i].style.opacity = '1';
    }
    searchField.style.backgroundColor = 'rgba(255,255,255,1)';
    searchButton.style.backgroundColor = '#282a29';
    searchField.style.color = 'black';
    areaInfo.style.color = 'black';

    themeMenu.style.backgroundColor = '#282828';
    themeNotch.style.backgroundColor = '#282828';

    copyright.style.color = 'rgba(255,255,255,.65)';
}
//classic theme function
function classicTheme() {
    const tag = document.querySelectorAll('h4');
    const areaInfo = document.getElementsByClassName('areaInfo')[0];
    infoContainer.style.backgroundColor = '#0E5966'
    menuOptions.classList.toggle('show');
    infoElement[0].style.backgroundColor = 'rgba(255,255,255,.2)';
    infoElement[1].style.backgroundColor = 'rgba(255,255,255,.2)';
    for (i = 0; i < tag.length; i++) {
        tag[i].style.backgroundColor = '#4B9CAA';
        tag[i].style.color = 'white';
        tag[i].style.opacity = '1';
    }
    searchField.style.backgroundColor = 'rgba(25,155,179,1)';
    searchButton.style.backgroundColor = '#0E5966';
    searchField.style.color = 'white';
    areaInfo.style.color = 'white';

    themeMenu.style.backgroundColor = '#0E5966';
    themeNotch.style.backgroundColor = '#0E5966';

    copyright.style.color = 'rgba(255,255,255,.65)';
}