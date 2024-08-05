$(document).ready(function() {
    const apiUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
    const apiStatUrl = 'http://0.0.0.0:5001/api/v1/status/'

    $.get(apiStatUrl, function(data) {
        if (data.status === "OK") {
            $('#api_status').addClass('api-available').attr('title', 'API Status: API connected');
            console.log('API status OK, class added');
        } else {
        $('#api_status').removeClass('api-available');
        console.log('API status not OK, class removed');
        }
    }).fail(function() {
        $('#api_status').removeClass('api-available').attr('title', 'API Status: Failed');
    });

    let listOfCheckedAmenities = {}

    $('input').change(function() {
        const amenityName = $(this).attr("data-name");
        if (this.checked) {
            listOfCheckedAmenities.push(amenityName);
        } else {
            listOfCheckedAmenities = listOfCheckedAmenities.filter((item) => item !== amenityName);
        }
        $('div.amenities h4').text(listOfCheckedAmenities.join(', '));
    });

    $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(places) {
            $.each(places, function(index, place) {
                const placeHtml = `
                    <article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guests</div>
                            <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
                    </article>
                `;
                $('.places').append(placeHtml);
            });
        },
        error: function() {
            console.error('Failed to retrieve places');
        }
    });
});