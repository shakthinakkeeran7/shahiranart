
        // Function to update price based on selected options
        function updatePrice(parsedData) {
          var selectedCharacters = parseInt(
            document.getElementById("character-faces").value
          );
          var selectedSize = document.getElementById("portrait-size").value;
          var selectedFraming = document.getElementById("framing-options").value;
      
          // Find the matching offer based on the selected options
          var matchingOffer = parsedData.offers.find(function (offer) {
            return (
              offer.name.includes(selectedCharacters + " / " + selectedSize) &&
              offer.name.includes(selectedFraming)
            );
          });
      
          // If no matching offer is found, find the next available offer for the selected Number Of Character/Faces
          if (!matchingOffer) {
            var index = parsedData.offers.findIndex(function (offer) {
              return offer.name.startsWith(selectedCharacters + " / ");
            });
            var nextOffer = parsedData.offers[index + 1];
      
            // If a next offer is found, update the selected Choose Size and update price accordingly
            if (nextOffer) {
              var newSize = nextOffer.name.split(" / ")[1].trim();
              document.getElementById("portrait-size").value = newSize;
              updatePrice(parsedData); // Recursively call updatePrice to ensure price is updated for the new size
              return;
            }
      
            // If no next offer is found, set price to $0.00 and exit
            document.getElementById("price").textContent = "Price: $0.00";
            return;
          }
      
          // Get the price from the matching offer
          var price =
            matchingOffer.price.toFixed(2) + " " + matchingOffer.priceCurrency;
      
          // Update the price display
          document.getElementById("price").textContent = "Price: " + price;
        }
      
        // Function to set default dropdown values based on JSON data
        function setDefaultDropdownValues(parsedData) {
          var defaultOffer = parsedData.offers[0]; // Assuming the first offer in the JSON data is the default one
      
          // Extract default values from the default offer name
          var defaultCharacters = parseInt(
            defaultOffer.name.split(" / ")[0].trim()
          );
          var defaultSize = defaultOffer.name.split(" / ")[1].trim();
          var defaultFraming = defaultOffer.name.split(" / ")[2].trim();
      
          // Set default values for dropdowns
          document.getElementById("character-faces").value = defaultCharacters;
          document.getElementById("portrait-size").value = defaultSize;
          document.getElementById("framing-options").value = defaultFraming;
      
          // Update the price based on default values
          updatePrice(parsedData);
        }
      
        // Attach event listener to the fetch call to perform actions once JSON data is fetched
        fetch(
          "https://raw.githubusercontent.com/shakthinakkeeran7/shahiranart/master/form.json"
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((parsedData) => {
            // Use the parsed JSON data here
            console.log(parsedData);
      
            // Call functions to set default dropdown values and update price based on selected options
            setDefaultDropdownValues(parsedData);
      
            // Attach event listeners to all dropdowns
            var dropdowns = document.querySelectorAll("select");
            dropdowns.forEach(function (dropdown) {
              dropdown.addEventListener("change", function () {
                updatePrice(parsedData);
              });
            });
      
            // Function to send WhatsApp message
            function sendWhatsAppMessage() {
              var selectedSize = document.getElementById("portrait-size").value;
              var selectedFraming = document.getElementById("framing-options").value;
              var selectedCharacters =
                document.getElementById("character-faces").value;
              var message =
                "I would like to order " +
                selectedCharacters +
                " characters, size: " +
                selectedSize +
                ", framing option: " +
                selectedFraming +
                ". Please contact me.";
      
              // Redirect to WhatsApp with pre-filled message
              window.open(
                "https://wa.me/917418380095?text=" + encodeURIComponent(message),
                "_blank"
              );
            }
          })
          .catch((error) => {
            console.error("There was a problem fetching the JSON file:", error);
          });
   
      