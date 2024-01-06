// Use AMD (Asynchronous Module Definition) require to load ArcGIS modules
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Expand",
  "esri/geometry/Extent",
], function (esriConfig, Map, MapView, FeatureLayer, Expand, Extent) {
  if (!esriConfig.apiKey) {
    esriConfig.apiKey =
      "AAPKd1a4829fdcec40688663415efd08d925_EcJjVNIfhG14rhCJTnkIeI7wwfNQ2ms-UaLgjYHBj7_ugxe0uXc14iV9epHKw2V";
  }

  try {
    // Select elements within the calcite-panel for easy access
    const panel = document.querySelector("#infoDiv");

    // Select input elements
    const distanceInput = panel.querySelector("#distanceInput");
    const datePickerInput = panel.querySelector("#datePickerInput");

    // Select button elements
    const clearButton = panel.querySelector("#clearButton");
    const submitButton = panel.querySelector("#submitButton");

    // Validate the existence of required elements
    if (
      !distanceInput ||
      !datePickerInput ||
      !clearButton ||
      !submitButton
    ) {
      throw new Error("One or more required elements not found.");
    }

    // Create an ArcGIS Map and MapView
    const map = new Map({
      basemap: "streets",
    });

    const view = new MapView({
      map: map,
      center: [143.743, -35.384],
      zoom: 7,
      container: "viewDiv",
    });

    // Validate MapView initialization
    if (!view) {
      throw new Error("MapView initialization failed.");
    }

    // Add calcite-panel to the top-right corner of the MapView
    view.ui.add("panelDiv", "top-right");

    //Murray River feature layer (polyline)
    const murrayRiverLayerUrl =
      "https://services3.arcgis.com/yWULcCvrXPnOomH2/arcgis/rest/services/murray_river/FeatureServer";
    const murrayriverLayer = new FeatureLayer({
      url: murrayRiverLayerUrl,
    });

    map.add(murrayriverLayer, 0);

    // Function to update button state based on input values
    const updateButtonState = () => {
      const distanceInputValue = parseFloat(distanceInput.value);
      const datePickerInputValue = datePickerInput.value;

      // Enable the "Clear" button if either input field has a value
      clearButton.disabled = !(
        distanceInputValue || datePickerInputValue
      );

      // Enable the "Submit" button if both input fields have values
      submitButton.disabled = !(
        distanceInputValue && datePickerInputValue
      );
    };

    // Add event listeners to input fields
    distanceInput.addEventListener("input", updateButtonState);

    // Use input and blur events for date picker component
    datePickerInput.addEventListener("input", updateButtonState);
    datePickerInput.addEventListener("blur", updateButtonState);

    // Add event listener to the Clear button
    clearButton.addEventListener("click", () => {
      distanceInput.value = "";
      datePickerInput.value = "";
      updateButtonState();
    });

    // Add event listener to the Submit button
    submitButton.addEventListener("click", () => {
      const dateValue = datePickerInput.value;
      const distanceValue = distanceInput.value;

      // Clear input fields after submission
      distanceInput.value = "";
      datePickerInput.value = "";

      // Update button state after clearing input fields
      updateButtonState();

      // Display a message with the date and distance values
      alert(`Date: ${dateValue} | Distance: ${distanceValue}`);
    });
  } catch (error) {
    console.error("An error occurred:", error.message);
    // Additional handling included here as needed.
  }
});