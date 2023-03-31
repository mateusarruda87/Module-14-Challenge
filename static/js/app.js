// Create url variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create function to initialize the app
function init() {
    var menu = d3.select("#selDataset");
    d3.json(url).then((response) => {
        var samples = response.names;
        samples.forEach((sample) => {menu.append("option").text(sample).property("value", sample);
        });

        var firstSample = samples[0];
        charts(firstSample);
        metadata(firstSample);
    });

}

init();

// Create function to update the app when select a new sample
function optionChanged(new_sample) {
    charts(new_sample);
    metadata(new_sample);
}

// Create function for the metadata
function metadata(sample) {
    d3.json(url).then((response) => {
        var metadata = response.metadata;
        var results = metadata.filter(sample_obj => sample_obj.id == sample);
        var result = results[0];
        var panel = d3.select("#sample-metadata");
        panel.html("")
        Object.entries(result).forEach(([key, value]) => {panel.append("h5").text(`${key}: ${value}`)});
    });
}

// Create function for the charts
function charts(sample) {
    d3.json(url).then((response) => {
        
        // Extract the variables for the charts
        var samples = response.samples;
        var selectedSample = samples.filter(sample_obj => sample_obj.id == sample);
        var firstSample = selectedSample[0];
        var otu_ids = firstSample.otu_ids;
        var otu_labels = firstSample.otu_labels;
        var sample_values = firstSample.sample_values;
        var ytick = otu_ids.slice(0, 10).map(otuID => `OTU: ${otuID}`).reverse()
        
        // Create the bar chart
        var barChart =[{
            type: 'bar',
            x: sample_values.slice(0, 10).reverse(),
            y: ytick,
            orientation: 'h',
            text: otu_labels.slice(0, 10).reverse()
        }];
        Plotly.newPlot('bar', barChart);

        // Create the bubble chart
        var bubbleChart = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: "Jet"
            }
        };
        var bubbleLayout = {
            xaxis: { title: "OTU ID"},
        };
        Plotly.newPlot("bubble", [bubbleChart], bubbleLayout);
        });
}