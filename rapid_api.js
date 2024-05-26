

module.exports = {

    search_place_details: async function (place_name)
    {
        const url = `https://maps-data.p.rapidapi.com/searchmaps.php?query=${place_name}, Kolkata&limit=10&country=in&lang=en&lat=22.5744&lng=88.3629&offset=0&zoom=13`;
        const options = 
        {
            method: 'GET',
            headers: 
            {
                'X-RapidAPI-Key': '9bc4a114admsh516796bd44b6d6fp1e176djsnb672ad614c73',
                'X-RapidAPI-Host': 'maps-data.p.rapidapi.com'
            }
        };

        try 
        {
            const response = await fetch(url, options);
            const result = await response.json();

            let place_details = [];

            result["data"].forEach(element => 
            {
                let data = {};
                data.name = element.name;
                data.address = element.full_address;
                data.lat = element.latitude;
                data.ln = element.longitude;
                data.rating = element.rating;
                data.photos = [];

                element.photos.forEach(photo =>
                    {
                        data.photos.push(photo.src);
                    });

                data.description = element.description;
                place_details.push(data);
            });

            return {success: true , data: place_details};
        } 
        catch (error) 
        {
            return {success: false , error: error};
        }
    },

    search_sub_items: async function (query)
    {
        const url = `https://google-web-search1.p.rapidapi.com/?query=${query}&limit=20&related_keywords=true`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '9bc4a114admsh516796bd44b6d6fp1e176djsnb672ad614c73',
                'X-RapidAPI-Host': 'google-web-search1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            return {success: true , data: (await response.json()).results};
            
        } catch (error) {
            return {success: false , error: error};
        }
    }
}