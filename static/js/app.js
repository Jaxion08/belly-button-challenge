// Read in samples.json from url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch and parse JSON with D3
d3.json(url)
    .then(function(data) {
        // Extract data
        sampleData = data.samples
        metadataData = data.metadata

        console.log(data)
        // Select the dropdown
        const dropdown = d3.select("#selDataset")

        // Populate the dropdown
        sampleData.forEach(sample => {
            dropdown.append("option").attr("value", sample.id).text(sample.id);
        })

        // Initialize the page with data
        const initialSubject = sampleData[0]
        updateCharts(initialSubject)
        createBubbleChart(initialSubject)
        const initialMetadata = metadataData.find(metadata => metadata.id == initialSubject.id);
        displaySampleMetadata(initialMetadata)
    })
    
    .catch(function(error) {
        console.error("Error loading the JSON file:", error)
    })

// Select top 10 OTUs
function updateCharts(subject) {
    const top10OTUs = subject.sample_values.slice(0, 10).reverse()
    const top10OTULabels = subject.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse()
    const top10OTUHoverText = subject.otu_labels.slice(0, 10).reverse()

    // Create horizontal bar chart
    const trace1 = {
        x: top10OTUs,
        y: top10OTULabels,
        text: top10OTUHoverText,
        type: "bar",
        orientation: "h"
    }

    const data = [trace1];

    const layout = {
        title: "Top 10 OTUs",
        //xaxis: { title: "Sample Values" },
        //yaxis: { title: "OTU Labels" },
        width: 400,
        height: 400,
        margin: {
            l: 75,
            r: 0,
            b: 25,
            t: 50
        }
    }

    Plotly.newPlot("bar", data, layout)
}

// Add border to bar chart
document.getElementById("bar").style.border = "2px solid black"

// Create bubble chart
function createBubbleChart(subject) {
    const trace2 = {
        x: subject.otu_ids,
        y: subject.sample_values,
        text: subject.otu_labels,
        mode: "markers",
        marker: {
            size: subject.sample_values,
            color: subject.otu_ids,
            colorscale: "Viridis"
        }
    }

    const data = [trace2];

    const layout = {
        title: "Bacteria Cultures per Sample",
        xaxis: { title: "OTU ID" },
        showlegend: false,
        width: 1000,
        height: 400,

    };

    Plotly.newPlot("bubble", data, layout);
}

// Function to display sample metadata
function displaySampleMetadata(metadata) {
    // Select the HTML element where you want to display the metadata
    const metadataDiv = d3.select("#sample-metadata");

    // Clear any existing content in the div
    metadataDiv.html("");

    // Loop through the metadata object and append key-value pairs to the div
    Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
    });
}

// Function for dropdown change
function optionChanged(selectedSubjectID) {
    const selectedSubject = sampleData.find(sample => sample.id === selectedSubjectID)
    updateCharts(selectedSubject)
    createBubbleChart(selectedSubject)
}

document.getElementById("bubble").style.border = "2px solid black"

// Function for dropdown change
function optionChanged(selectedSubjectID) {
    const selectedSubject = sampleData.find(sample => sample.id === selectedSubjectID);
    updateCharts(selectedSubject);
    createBubbleChart(selectedSubject);
    
    // Display the sample metadata for the selected subject
    const selectedMetadata = metadataData.find(metadata => metadata.id == selectedSubjectID);
    displaySampleMetadata(selectedMetadata);
}