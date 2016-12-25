// create dataset
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
			function(m, key, value) {
				vars[key] = value;
			});
	return vars;
}

function draw_legend_table(nodes, tableBodyId,tableId) {
	// console.log(nodes)
	table = document.getElementById(tableId);
	tbody = document.getElementById(tableBodyId);
	tbody.innerHTML="";
	console.log(table)
	for (i = 0; i < nodes.length; i++) {

		console.log(nodes[i]);

		row = tbody.insertRow(i )
		c1 = row.insertCell(0)
		c1.innerHTML = nodes[i].label;
		c1.style.width='50px';
		//row.insertCell(1).innerHTML = "<a href='#'>"+nodes[i].title+"</a>"
		c2 = row.insertCell(1);
		c2.innerHTML = "<a href='javascript:void(0);' onClick='draw_sub_graph(" + i + ");'>" + nodes[i].title + "</a>";
		c2.style.width='200px';
	}
	table.style.display="block";
	return false;

}

function draw_sub_graph(id) {
	console.log(id)
	div = document.getElementById("subGraphDiv");
	var e = document.getElementById("graph_name");
	var graph_name = e.options[e.selectedIndex].value;

	d3.json("../data/" + graph_name + ".json", function(data) {
		d = get_sub_graphs(data, id);
		
		var options = {
			width : '360px',
			height : '262px',
			nodes : {
				shape : 'dot',
				radiusMin : 10,
				radiusMax : 35,
				fontSize : 30
			},
			edges : {
				style : 'arrow',
				widthMin : 1,
				widthMax : 10
			},
			tooltip : {
				delay : 100
			}
		};
		var c1 = document.getElementById('inSubGraph');
		var c2 = document.getElementById('outSubGraph');
		c1.innerHTML = "";
		c2.innerHTML="";
		document.getElementById('inSubGraphContainer').style.display='block'
		document.getElementById('outSubGraphContainer').style.display='block'
		document.getElementById('titleOutSubGraph').innerHTML = "Influenced by:: "+ d["map"][id].title +" ("+ id +")"
		document.getElementById('titleInSubGraph').innerHTML  = "Influencers of "+ d["map"][id].title +" ("+ id +")"
		var n1 = new vis.Network(c1, d["in_graph"], options);
		var n2 = new vis.Network(c2, d["out_graph"], options);
		
		
	});
}

function get_sub_graphs(data, id) {
	in_g = {
		"nodes" : [],
		"edges" : []
	};
	out_g = {
		"nodes" : [],
		"edges" : []
	};
	node_map = {}
	for (i = 0; i < data["nodes"].length; i++) {
		node_map[data["nodes"][i].id] = data["nodes"][i]
	}
	in_g["nodes"].push(node_map[id])
	out_g["nodes"].push(node_map[id])

	for (i = 0; i < data["edges"].length; i++) {
		e = data["edges"][i]
		if (e.from == id) {
			out_g["edges"].push(e)
			out_g["nodes"].push(node_map[e.to])
		} else if (e.to == id) {
			in_g["edges"].push(e)
			in_g["nodes"].push(node_map[e.from])
		}
	}
	return {
		"in_graph" : in_g,
		"out_graph" : out_g,
		"map":node_map
	}
}

function plot_full_graph() {

	var e = document.getElementById("graph_name");
	var graph_name = e.options[e.selectedIndex].value;

	d3.json("../data/" + graph_name + ".json", function(data) {
		console.log(data);
		document.getElementById('globalGraphContainer').style.display='block';
		var container = document.getElementById('globalGraph');
		
		var options = {
			width : '800px',
			height : '580px',
			nodes : {
				shape : 'dot',
				radiusMin : 10,
				radiusMax : 35,
				fontSize : 30
			},
			edges : {
				style : 'arrow',
				widthMin : 1,
				widthMax : 10
			},
			tooltip : {
				delay : 100
			}
		};
		var network = new vis.Network(container, data, options);
		draw_legend_table(data["nodes"],"legendTableBody", "legendTable")
	});
	
	draw_sub_graph(0)
}
