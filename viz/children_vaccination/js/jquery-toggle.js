function changec() {
    var xDiv = document.getElementById('maps-container');
    if (xDiv.style.height === '96%')
        xDiv.style.height = '75%'
    else
        xDiv.style.height = '96%'
    var btMenu = document.getElementById('side-bar-container-two');
    if(xDiv.style.height==="75%")
       btMenu.style.display = 'block'
    else
       btMenu.style.display ='none'
};


// $(document).ready(function(){
//     $(".legend-window-menu").click(function(){
//         $("#legends-cont").toggle();
//     });
// });
//
// function changeHeight(){
//   var x = document.getElementById('side-bar-container');
//
// }
// onClick = "document.getElementById('chartdiv').style.height = '200px';"
