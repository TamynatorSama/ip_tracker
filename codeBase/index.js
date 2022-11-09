const submit  =  document.querySelector('.sub')
const ip  =  document.querySelector('.ip')
const loc  =  document.querySelector('.loc')
const time  =  document.querySelector('.time')
const isp  =  document.querySelector('.isp')
const input = document.querySelector('.input--grp input')



let map = L.map('map').setView([51.505,-0.09],13)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribute:  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

var locationPin = L.icon({
    iconUrl: '../images/marker-icon.png',
    shadowUrl: '../images/marker-shadow.png',

    iconSize:     [38, 45], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var marker = L.marker([34.04915, -118.09462], {icon: locationPin}).addTo(map);

window.addEventListener('load',()=>{
    fetchData("192.212.174.101")
})

submit.addEventListener('click',async()=>{
    const date = new Date() 
    console.log(date.toUTCString())
    console.log(date.getUTCHours())
    if(input.value == "" || input.value == " " || !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(input.value)){
        return
    }
    fetchData(input.value)
})

const fetchData = async(input)=>{
    let response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_I9LSidK8HATOAovgoc6xnSL3nzF64&ipAddress=${input}`)
    if(response.status == 200){
        const date = new Date() 
        let data = await response.json()
        ip.innerText = data.ip
        loc.innerText = `${data.location.city},${data.location.postalCode}`
        let offset = Number(data.location.timezone.split(":")[0].replace("0","").replace("+","").replace("-",""))
        console.log(offset)
        let newtime
        if(data.location.timezone.includes("-")){
            newtime = date.getUTCHours() - offset
        }
        else{
            console.log("not cool")
            newtime = date.getUTCHours() + offset
        }
        time.innerText = `UTC-${newtime}:${date.getUTCMinutes().toString().length > 1 ?date.getUTCMinutes():`0${date.getUTCMinutes()}`}`
        isp.innerText = data.isp
        console.log(data.location.lat)
        map.panTo(L.latLng(data.location.lat, data.location.lng)); 
        let lat = data.location.lat
        let lng = data.location.lng
        let newLatLng = new L.LatLng(lat,lng)
        marker.setLatLng(newLatLng)
    }
}
