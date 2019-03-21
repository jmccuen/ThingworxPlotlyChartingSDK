function TWRuntimeChart(widget) {
    let properties = widget.properties;
    let chartId;
    let chart = this;
    

    this.layout = new Object;
    this.chartData = [];
    this.chartInfo = {};
    this.chartDiv;
    this.plotted = false;

    this.render = function() {
        chartId = widget.jqElementId;

        chart.chartData = [];
        let chartDiv = document.getElementById(widget.jqElementId);

        chart.layout = {
			showlegend: properties['ShowLegend'],
			legend: {'orientation': 'h'},
			font: {
				color: 'black',
				size: 11
            },
            plot_bgcolor: '#fff'
        };

        if (properties['ShowTitle']) {
            let titleStyle = TW.getStyleFromStyleDefinition(properties['ChartTitleStyle'],'DefaultChartTitleStyle');
            let title = new Object();
            title.text = properties['ChartTitle'];
            title.font = new Object();
            title.font.size = Number(getFontSize(titleStyle.textSize));
            title.font.color = titleStyle.foregroundColor;
            title.x = properties['ChartTitleX'];
            title.y = properties['ChartTitleY'];
            chart.layout.title = title;
        }

        let margin = new Object();
        margin.t = properties['MarginTop'];
        margin.b = properties['MarginBottom'];
        margin.l = properties['MarginLeft'];
        margin.r = properties['MarginRight'];

        chart.layout.margin = margin;

        chart.layout.xaxis = getAxisObject('X',1);
        chart.layout.yaxis = getAxisObject('Y',1);

        for (let i = 2; i <= properties['NumberOfXAxes'];i++) {
            chart.layout['xaxis' + i] = getAxisObject('X',i);
        }
        for (let i = 2; i <= properties['NumberOfYAxes'];i++) {
            chart.layout['yaxis' + i] = getAxisObject('Y',i);
        }
        
        Plotly.newPlot(chartDiv, chart.chartData, chart.layout, {displayModeBar: false});
        if (properties['AllowSelection']) {
            chartDiv.on('plotly_click', chart.handleClick);
        }

    }

    this.extend = function(data) {
        Plotly.extendTraces(chartId,data, [0]);

    }


    this.draw = function(data) {
        chart.plotted = true;
        for (let i=1;i<=data.length;i++) {
            trace = data[i-1];
            let series = trace.series;
            if (trace.type == "scatter") {
                let style = TW.getStyleFromStyleDefinition(properties['SeriesStyle' + series],'DefaultChartStyle' + series);
                let line = new Object();
                line.color = style.lineColor;
                trace.line = line;
                trace.name = properties['SeriesLabel' + series];
                if (properties['XAxis' + series] !== 'x1') {
                    trace.xaxis = properties['XAxis' + series];
                };
                if (properties['YAxis' + series] !== 'y1') {
                    trace.yaxis = properties['YAxis' + series];
                };
            }

            let exists = false;
            for (let i = 0; i<chart.chartData.length;i++) {
                if (trace.series === chart.chartData[i].series) {
                    chart.chartData[i] = trace;
                    exists = chart;
                }
            }
            if (!exists) {
                chart.chartData.push(trace);
            }
            
        }

        Plotly.react(chartId,chart.chartData,chart.layout,{displayModeBar: false});
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
    };

    this.handleSelectionUpdate = function (propertyName, selectedRows, selectedRowIndices) {
    
    };

    function getFontSize(text) {
    	return TW.getTextSize(text).split(": ")[1].replace("px;","");
    };

    this.getXY = function(it) {
		const rows = it.ActualDataRows;
		let values = new Object();
        let x = [];       
        let y = new Object();
        
        for (let i=0;i<rows.length;i++) {
        	x.push(rows[i][properties['XAxisField']]);
       	for (let j=1;j<=properties['NumberOfSeries'];j++) {
       		if (properties['YDataField' + j]) {
					if (!y[j]) {	
						y[j] = new Object();
						y[j].values = [];
					};
		    		y[j].values.push(rows[i][properties['YDataField' + j]]);
       		};
       	};
        };
        
        values.x = x;
        values.y = y;
        
        return values;
	}
	this.getDynamicXY = function(it) {
		const rows = it.ActualDataRows;
		let values = new Object();
        let x = [];
        let y = {};
		let shape = it.DataShape;
		
		for (let i=0;i<rows.length;i++) {
			let count = 1;
			x.push(rows[i][properties['XAxisField']]);
			for (let key in shape) {
				if (shape[key].baseType === 'NUMBER' || shape[key].baseType === 'INTEGER') {
					if (!y[count]) {	
						y[count] = new Object();
						y[count].values = [];
					};
					y[count].values.push(rows[i][key]);
					count++;
				};
			};
		};
		values.x = x;
		values.y = y;
		
        return values
    };
    
    function getAxisObject(xy,i) {
        
        let style = TW.getStyleFromStyleDefinition(properties[xy + 'AxisStyle' + i],'DefaultChartStyle' + i);
        let tickStyle = TW.getStyleFromStyleDefinition(properties[xy + 'AxisTickStyle' + i],'DefaultChartStyle' + i);
        let lineStyle = TW.getStyleFromStyleDefinition(properties[xy + 'AxesLineStyle'],'DefaultChartStyle');
        let gridStyle = TW.getStyleFromStyleDefinition(properties[xy + 'AxesGridStyle'],'DefaultChartStyle');

        let axis = new Object();
        axis.visible = properties[xy + 'AxesVisible'];
        axis.title = {
            text: properties[xy + 'AxisTitle' + i],
            font: {
                color: style.foregroundColor,
                size: getFontSize(style.textSize)
            }
        },
        axis.type = properties[xy + 'AxisType' + i];
        axis.autorange = properties[xy + 'AxesAuto'];
        axis.tickmode = properties[xy + 'AxesTicks'];
        axis.nticks = properties[xy + 'AxesTickMax'];
        axis.tickwidth = properties[xy + 'AxesTickWidth'];
        axis.tickcolor = tickStyle.backgroundColor;
        axis.tickfont = {
            color: tickStyle.backgroundColor,
            size: getFontSize(tickStyle.textSize)
        };
        axis.tickangle = properties[xy + 'AxesTickAngle'];
        axis.tickformat = properties[xy + 'AxisTickFormat' + i];
        axis.showline = properties[xy + 'AxesShowLine'];
        axis.linecolor = lineStyle.backgroundColor;
        axis.showgrid = properties[xy + 'AxesShowGrid'];
        axis.gridstyle = gridStyle.backgroundColor;
        if (i>1) {
            axis.overlaying = xy.toLowerCase();
            axis.side = properties[xy + 'AxisSide' + i];
            axis.position = properties[xy + 'AxisPosition' + i];
            axis.anchor = properties[xy + 'AxisAnchor' + i]
        }
        return axis;
    }

    widget.resize = function(width,height) {
        let update = {
            width: width,
            height: height
        }

        Plotly.relayout(chartId, update);
    };

    widget.runtimeProperties = function () {
        return {
            'needsDataLoadingAndError': true,
	        'supportsAutoResize': true
        };
    };

    widget.beforeDestroy = function () {
       Plotly.purge(chartId);
    };


}