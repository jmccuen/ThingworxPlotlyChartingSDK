function TWIDEChart(widget, maxSeries, hasMultipleData, hasX, hasY, hasZ, multipleX) {

    this.MAX_SERIES = maxSeries;
    let layout = new Object();
    let chartId;
    let chartData = [];
    let chart = this;

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
            'description': 'Position from 0-1',
            'baseType': 'NUMBER',
            'isVisible': true,
            'defaultValue': 0.5,
            'isBindingTarget': false
        };

        properties.ChartTitleY = {
            'description': 'Position from 0-1 or auto',
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

        if (hasX) {
            properties.XAxisField = {
                'description': TW.IDE.I18NController.translate('tw.xychart-ide.properties.x-axis-field.description'),
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
                'isVisible': true
            };

            properties.XAxisTickMode = {
                'description': '',
                'baseType': 'STRING',
                'defaultValue': 'auto',
                'isVisible' : true,
                'selectOptions': [
                    { value: 'auto', text: 'Auto' },
                    { value: 'linear', text: 'Linear' },
                    { value: 'array', text: 'InfoTable' }
                ]
            };

            properties.XAxisTickMax =  {
                'description': 'Max number of X Axis Ticks, if tick mode is auto',
                'baseType': 'NUMBER',
                'isVisible': true,
                'defaultValue': 0,
                'isBindingTarget': false
            };


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

            let dataXProperty = {
                'description': 'X Axis Field ' + seriesNumber,
                'baseType': 'FIELDNAME',
                'sourcePropertyName': 'Data',
                'isBindingTarget': false,
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

            var dataLabelProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.data-label-property.description') + seriesNumber,
                'baseType': 'STRING',
                'isBindingTarget': true,
                'isVisible': true,
                'isLocalizable': true
            };
                
            let seriesStyleProperty = {
                'description': TW.IDE.I18NController.translate('tw.labelchart-ide.series-style-property.description') + seriesNumber,
                'baseType': 'STYLEDEFINITION',
                'isVisible': true
            };

            if(hasMultipleData) { properties['DataSource' + seriesNumber] = dataSourceProperty };
            if (hasX && multipleX) { properties['XDataField' + seriesNumber] = dataXProperty };
            if (hasY) { properties['YDataField' + seriesNumber] = dataYProperty };
            if (hasZ) { properties['ZDataField' + seriesNumber] = dataZProperty };
            properties['SeriesLabel' + seriesNumber] = dataLabelProperty;
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

    widget.afterLoad = function() {
        chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
    }

    widget.afterSetProperty = function (name, value) {
        if (name === 'NumberOfSeries' || name === 'SingleDataSource') {
            chart.setSeriesProperties(widget.getProperty('NumberOfSeries'));
            widget.updatedProperties();
            return true;
        };

        if (name === 'XAxisTickMode') {
            if (value === 'auto') {
                let properties = widget.allWidgetProperties();
                properties['properties']['XAxisTicMax']['isVisible'] = true
            } else {
                properties['properties']['XAxisTicMax']['isVisible'] = false
            }
            widget.updatedProperties();
            return true;
        }
    }

    this.setSeriesProperties = function (value) {
        let properties = widget.allWidgetProperties();
        let seriesNumber;
        let singleSource = true; 
        if (hasMultipleData) { singleSource = widget.getProperty('SingleDataSource') };

        for (seriesNumber = 1; seriesNumber <= value; seriesNumber++) {
            if (hasX && hasMultipleData) { properties['properties']['XDataField' + seriesNumber]['isVisible'] = !singleSource };
            if (hasY) { properties['properties']['YDataField' + seriesNumber]['isVisible'] = true };
            if (hasMultipleData) { properties['properties']['DataSource' + seriesNumber]['isVisible'] = !singleSource };
            properties['properties']['SeriesLabel' + seriesNumber]['isVisible'] = true;
            properties['properties']['SeriesStyle' + seriesNumber]['isVisible'] = true;     
        }

        for (seriesNumber = value + 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
            if (hasX && hasMultipleData) { properties['properties']['XDataField' + seriesNumber]['isVisible'] = false };
            if (hasY) { properties['properties']['YDataField' + seriesNumber]['isVisible'] = false};
            if (hasMultipleData) { properties['properties']['DataSource' + seriesNumber]['isVisible'] = false };
            properties['properties']['SeriesLabel' + seriesNumber]['isVisible'] = false;
            properties['properties']['SeriesStyle' + seriesNumber]['isVisible'] = false;
        }

        if (hasMultipleData) {
            
            if (singleSource) {
                for (seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
                    if (hasX) { properties['properties']['XDataField' + seriesNumber]['sourcePropertyName'] = 'Data' };
                    if (hasY) { properties['properties']['YDataField' + seriesNumber]['sourcePropertyName'] = 'Data' };
                }
                properties['properties']['Data']['isVisible'] = true;
                properties['properties']['XAxisField']['isVisible'] = true;
            } else
            {
                for (seriesNumber = 1; seriesNumber <= this.MAX_SERIES; seriesNumber++) {
                    properties['properties']['XDataField' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
                    properties['properties']['YDataField' + seriesNumber]['sourcePropertyName'] = 'DataSource' + seriesNumber;
                }
                properties['properties']['Data']['isVisible'] = false;
                properties['properties']['XAxisField']['isVisible'] = false;
            }
        }
    }


}

function TWRuntimeChart(widget) {
    let properties = widget.properties;
    let chartId = widget.jqElementId;
    let chart = this;

    this.layout = new Object;
    this.chartData = [];
    this.chartInfo = {};
    this.chartDiv;

    this.render = function() {

        let numSeries = properties['NumberOfSeries'];

        this.chartData = [];
        let chartDiv = document.getElementById(widget.jqElementId);


        let titleStyle = TW.getStyleFromStyleDefinition(properties['ChartTitleStyle'],'DefaultChartTitleStyle');
        let title = new Object();
        title.text = properties['ChartTitle'];
        title.font = new Object();
        title.font.size = Number(getFontSize(titleStyle.textSize));
        title.font.color = titleStyle.foregroundColor;
        title.x = properties['ChartTitleX'];
        title.y = properties['ChartTitleY'];


        this.layout = {
			showlegend: properties['ShowLegend'],
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
            },
            plot_bgcolor: '#fff',
            title: title
        };

        if (properties['XAxisField']) {
            let xaxis = new Object();
            xaxis.tickmode = properties['XAxisTickMode'];
            xaxis.nticks = properties['XAxisTickMax'];

            this.layout.xaxis = xaxis;
        }
        
        Plotly.newPlot(chartDiv, this.chartData, this.layout, {displayModeBar: false});

        chartDiv.on('plotly_click', this.handleClick);

    }

    this.draw = function(data) {
        for (let i=1;i<=data.length;i++) {
            trace = data[i-1];
            let series = trace.series;
            if (trace.type == "scatter") {
                let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + series],'DefaultChartStyle' + series);
                let line = new Object();
                line.color = style.lineColor;
                trace.line = line;
                trace.name = properties['SeriesLabel' + series]
            }

            let exists = false;
            for (let i = 0; i<this.chartData.length;i++) {
                if (trace.series === this.chartData[i].series) {
                    this.chartData[i] = trace;
                    exists = true;
                }
            }
            if (!exists) {
                this.chartData.push(trace);
            }
            
        }

        

        Plotly.react(chartId,this.chartData,this.layout,{displayModeBar: false});
    }

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(chartId, update);

    }

    this.handleClick = function(data)
    {
        let pn='',
        tn='',
        series = '',
        source = '';
        for(let i=0; i < data.points.length; i++){
            pn = data.points[i].pointNumber;
            tn = data.points[i].curveNumber;
            series = data.points[i].data.series;
            source = data.points[i].data.dataSource;
        };
        let colors = [];
        if (!chart.chartInfo[source]['SeriesStyle' + series]) {
            colors = Array(chart.chartInfo[source].length);
            let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + series],'DefaultChartStyle' + series);
            for (let i = 0; i<chart.chartInfo[source].length;i++) {
                colors[i] = style.lineColor;
            }
            chart.chartInfo[source]['SeriesStyle' + series] = colors.splice(0);
        }
        colors = chart.chartInfo[source]['SeriesStyle' + series].slice(0);
        colors[pn] = '#FF0000';

        var update = {'marker':{color: colors}};
        Plotly.restyle(chartId, update, [tn]);
    }

    this.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {
    
    }

    function getFontSize(text) {
    	return TW.getTextSize(text).split(": ")[1].replace("px;","");
    }

}