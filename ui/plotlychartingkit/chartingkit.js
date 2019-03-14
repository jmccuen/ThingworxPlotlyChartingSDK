function TWIDEChart(widget, maxSeries, hasMultipleData, hasX, hasY, hasZ, multipleX) {

    this.MAX_SERIES = maxSeries;
    let layout = new Object();
    let chartId;

    this.getProperties = function() {
        let properties = new Object();

        properties.NumberOfSeries = {
            'description': 'Number of series in the chart',
            'defaultValue': 1,
            'baseType': 'NUMBER',
            'isVisible': true
        };

        if (hasMultipleData) { 
            properties.SingleDataSource = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.single-data-source.description'),
                'defaultValue': true,
                'baseType': 'BOOLEAN',
                'isVisible': true
            };
        }

        properties.Data = {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.data.description'),
            'isBindingTarget': true,
            'isEditable': false,
            'baseType': 'INFOTABLE',
            'warnIfNotBoundAsTarget': true
        };

        properties.ChartTitle = {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.chart-title.description'),
            'baseType': 'STRING',
            'isBindingTarget': true,
            'defaultValue': '',
            'isLocalizable': true
        };

        properties.ChartTitleStyle = {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.chart-title-style.description'),
            'baseType': 'STYLEDEFINITION',
            'defaultValue': 'DefaultChartTitleStyle'
        };

        properties.ChartTitleX = {
            'description': '',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0.5,
            'isBindingTarget': false
        };

        properties.ChartTitleY = {
            'description': '',
            'baseType': 'STRING',
            'isVisible': true,
            'defaultValue': 'auto',
            'isBindingTarget': false
        };

        properties.ShowLegend =  {
            'description': TW.IDE.I18NController.translate('tw.labelchart-ide.properties.show-legend.description'),
            'baseType': 'BOOLEAN',
            'defaultValue': true
        };

        properties.Width = {
            'description': 'Total width of the widget',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 90,
            'isBindingTarget': false
        };

        properties.Height =  {
            'description': 'Total height of the widget',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 30,
            'isBindingTarget': false
        }

        if (hasX && !multipleX) {
            properties.XAxisField = {
                'description': TW.IDE.I18NController.translate('tw.xychart-ide.properties.x-axis-field.description'),
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            }
        }

        for (let seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
            let dataSourceProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-set-property.description') + seriesNumber,
                'isBindingTarget': true,
                'isEditable': false,
                'baseType': 'INFOTABLE',
                'warnIfNotBoundAsTarget': false,
                'isVisible': true
            };

            let dataYProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-field-property.description') + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };  
            
            let dataZProperty = {
                'description': 'Z Axis ' + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };  
                
            let seriesStyleProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-style-property.description') + seriesNumber,
                'baseType': 'STYLEDEFINITION',
                'isVisible': true
            };

            if(hasMultipleData) { properties['DataSource' + seriesNumber] = dataSourceProperty };
            if (hasY) { properties['YDataField' + seriesNumber] = dataYProperty };
            if (hasZ) { properties['ZDataField' + seriesNumber] = dataZProperty };
            properties['SeriesStyle' + seriesNumber] = seriesStyleProperty;
            properties['SeriesStyle' + seriesNumber]['defaultValue'] = 'DefaultChartStyle' + seriesNumber;

        }

        
        let result = {
            'category': ['Data', 'Charts'],
            'supportsLabel': false,
            'supportsAutoResize': true,
            'borderWidth': '1',
            'defaultBindingTargetProperty': 'Data',
            'properties': properties
        }

        return result;

    }

    this.render = function() {
        chartId = widget.jqElementId;

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
        
        Plotly.newPlot(chartId, chartData, layout, {displayModeBar: false});

    }

    this.draw = function(data) {
        Plotly.react(chartId,data,layout,{displayModeBar: false});
    }

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(widget.jqElementId, update);
    }


}

function TWRuntimeChart(widget) {
    let properties = widget.properties;
    let jqElementId = widget.jqElementId;
    let chartId = jqElementId;
    let layout;

    this.render = function() {

        let numSeries = properties['NumberOfSeries'];
        let chartData = [];


        let titleStyle = TW.getStyleFromStyleDefinition(properties['ChartTitleStyle'],'DefaultChartTitleStyle');
        let title = new Object();
        title.text = properties['ChartTitle'];
        title.font = new Object();
        title.font.size = Number(getFontSize(titleStyle.textSize));
        title.font.color = titleStyle.foregroundColor;
        title.x = properties['ChartTitleX'];
        title.y = properties['ChartTitleY'];

        layout = {
			showlegend: properties['ShowLegend'],
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
			},
            plot_bgcolor: '#fff',
            title: title
        };
        
        Plotly.newPlot(chartId, chartData, layout, {displayModeBar: false});

    }

    this.draw = function(data) {

        for (i=1;i<=data.length;i++) {
            trace = data[i-1];
            let series = trace.series;
            if (trace.type == "scatter") {
                let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + i],'DefaultChartStyle' + i);
                let line = new Object();
                line.color = style.lineColor;
                trace.line = line;
            }
        }

        Plotly.react(chartId,data,layout,{displayModeBar: false});
    }

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(chartId, update);

    }

    function getFontSize(text) {
    	return TW.getTextSize(text).split(": ")[1].replace("px;","");
    }




}