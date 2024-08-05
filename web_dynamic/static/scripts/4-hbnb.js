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

    let CheckedAmenities = {}

    $('input[type="checkbox"]').change(function() {
        const amenityID = $(this).data('id')
        const amenityName = $(this).attr("data-name");
        if (this.checked) {
            CheckedAmenities[amenityID] = amenityName;
        } else {
            delete CheckedAmenities[amenityID]
        }

        const amenitiesList = Object.values(CheckedAmenities).join(', ');
        $('div.amenities h4').text(amenitiesList);
    });

    function search_by_filter() {
        const amenities = Object.keys(CheckedAmenities);
        const filters = JSON.stringify({amenities: amenities});

        $.ajax({
        url: apiUrl,
        type: "POST",
        contentType: "application/json",
        data: filters,
        success: function(places) {
            $('.places').empty();
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
    }

    // Trigger search on button click
    $('button').click(function() {
        search_by_filter();
    });

    // Initial search with no filters
    search_by_filter();
});