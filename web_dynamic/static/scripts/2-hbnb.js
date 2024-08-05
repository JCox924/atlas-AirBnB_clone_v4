$(document).ready(function() {
    const apiUrl = 'http://0.0.0.0:5001/api/v1/status/';
    $.get(apiUrl, function(data) {
        if (data.status === "OK") {
            $('#api_status').addClass('api-available');
            console.log('API status OK, class added');
        } else {
        $('#api_status').removeClass('api-available');
        console.log('API status not OK, class removed');
        }
    }).fail(function() {
        $('#api_status').removeClass('api-available').attr('title', 'API Status: Failed');
    });
});
