// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadt = data.metadata;
    console.log(metadt[0])
    // Filter the metadata for the object with the desired sample number
    let filteredData = metadt.filter(sampleObj => sampleObj.id == sample);
    let dt = filteredData[0];
    console.log(filteredData)

    // Use d3 to select the panel with id of `#sample-metadata`
    let paneldt = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    paneldt.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(dt).forEach(([key, value]) => {
      paneldt.append("h6").text(`${key.toUpperCase()}:${value}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    samplef = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleA = samplef.filter(sampleObj => sampleObj.id === sample);
    let sampleSelected = sampleA[0];


    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleSelected.otu_ids;
    let otu_labels = sampleSelected.otu_labels;
    let sample_val = sampleSelected.sample_values;

    // Build a Bubble Chart
     // Render the Bubble Chart

    
    let bubbldt = [{
      x: otu_ids, 
      y: sample_val, 
      mode: "markers", 
      marker:{
        size : sample_val,
        color: otu_ids, 
        colorscale: "Earth"

      }
    }];
    let bubblelay ={
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30, l: 150},
      x_axis: {title: "OTU ID"}
    };
    Plotly.newPlot('bubble', bubbldt, bubblelay);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    let y_val = otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse();
    let bardt = [{
      x: sample_val.slice(1,10).reverse(), 
      y: y_val,
      text: otu_labels.slice(0,10).reverse(),
      type: "bar", 
      orientation: "h"}
    ];
    let barlay = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150}
    };
    Plotly.newPlot('bar', bardt, barlay);

    
  });
}

// Function to run on page load
function init() {
  let dropdown = d3.select("#selDataset");
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let samplenam = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    samplenam.forEach((sample) => {
      dropdown.append("option")
      .text(sample)
      .property("value", sample);
    });

    // Get the first sample from the list
      let first = samplenam[0]
    // Build charts and metadata panel with the first sample
    buildCharts(first);
    buildMetadata(first);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
