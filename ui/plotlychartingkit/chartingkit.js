function TWIDEChart() {

    this.MAX_SERIES = 24;

    this.getStandardProperties = function() {

        let properties = {
            'category': ['Data', 'Charts'],
            'supportsLabel': false,
            'supportsAutoResize': true,
            'borderWidth': '1',
            'defaultBindingTargetProperty': 'Data',
            'properties': {
                'NumberOfSeries': {
                    'description': 'Number of series in the chart',
                    'defaultValue': 1,
                    'baseType': 'NUMBER',
                    'isVisible': true
                },
                'Data': {
                    'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.data.description'),
                    'isBindingTarget': true,
                    'isEditable': false,
                    'baseType': 'INFOTABLE',
                    'warnIfNotBoundAsTarget': true
                },
                'Width': {
                    'description': 'Total width of the widget',
                    'baseType': 'NUMBER',
                    'isVisible': true,
                    'defaultValue': 90,
                    'isBindingTarget': false
                },
                'Height': {
                    'description': 'Total height of the widget',
                    'baseType': 'NUMBER',
                    'isVisible': true,
                    'defaultValue': 30,
                    'isBindingTarget': false
                }
            }
        }

        for (let seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
            let datasetProperty = {
                'description': TW.IDE.I18NController.translate('tw.laabelchart-ide.data-set-property.description') + seriesNumber,
                'isBindingTarget': true,
                'isEditable': false,
                'baseType': 'INFOTABLE',
                'warnIfNotBoundAsTarget': false,
                'isVisible': true
            };

            let datafieldProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-field-property.description') + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'baseTypeRestriction': 'NUMBER',
                'isVisible': true
            };          
                
            let seriesStyleProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-style-property.description') + seriesNumber,
                'baseType': 'STYLEDEFINITION',
                'isVisible': true
            };

           
            properties.properties['DataSource' + seriesNumber] = datasetProperty;
            properties.properties['DataField' + seriesNumber] = datafieldProperty;
            properties.properties['SeriesStyle' + seriesNumber] = seriesStyleProperty;
            properties.properties['SeriesStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;
        }

        return properties;

    }

    this.getXAxisProperties = function() {

        let properties =  {
            'XAxisField': {
                'description': TW.IDE.I18NController.translate('tw.xychart-ide.properties.x-axis-field.description'),
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'baseTypeRestriction': 'NUMBER',
                'isVisible': true
            }
        }

        return properties;

    }

    this.getYAxisProperties = function() {

        let properties =  {
            'YAxisField': {
                'description': TW.IDE.I18NController.translate('tw.xychart-ide.properties.y-axis-field.description'),
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'baseTypeRestriction': 'NUMBER',
                'isVisible': true
            }
        }

        return properties;

    }

}

function TWRuntimeChart(widget) {
    let properties = widget.properties;
    let jqElementId = widget.jqElementId;
    let jqElement = widget.jqElement;
    let thisWidget = this;
    let layout = new Object();

    this.render = function() {

        let numSeries = properties['NumberOfSeries'];
        let chartData = [];

        layout = {
			showlegend: true,
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
			},
			plot_bgcolor: '#fff'
        };
        
        Plotly.newPlot(jqElementId, chartData, layout, {displayModeBar: false});

    }

    this.draw = function(data) {
        Plotly.react(jqElementId,data,layout,{displayModeBar: false});
    }

    this.resize = function(height,width) {

    }


}