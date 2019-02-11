function changeCSS(cssFile) {

    var oldlink = document.getElementsByTagName("link").item(0);
    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("href", cssFile + ".css");

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}

d3.select("select").on("change", function(d){
    
    var selected = d3.select("#dropdown").node().value;
    changeCSS(selected);
    d3.select('svg').remove();

    if (selected == "first") 
    {
        var link, node;
        var svg;
        var force;
        var width, height, root;

        width = 960;
        height = 500;
        
        svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);
            
        force = d3.layout.force()
            .size([width, height])
            .on("tick", tick);
        
        link = svg.selectAll(".link"),
        node = svg.selectAll(".node");
        
        d3.json("readme.json", function(error, json) {
           if (error) throw error;
        
           root = json;
           update();
        });


        function update() {
            var nodes = flatten(root),
                links = d3.layout.tree().links(nodes);

            // Restart the force layout.
            force
                .nodes(nodes)
                .links(links)
                .start();

            // Update the links…
            link = link.data(links, function(d) { return d.target.id; });

            // Exit any old links.
            link.exit().remove();

            // Enter any new links.
            link.enter().insert("line", ".node")
                .attr("class", "link")
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            // Update the nodes…
            node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

            // Exit any old nodes.
            node.exit().remove();

            // Enter any new nodes.
            node.enter().append("circle")
                .attr("class", "node")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
                .style("fill", color)
                .on("click", click)
                .call(force.drag);



        }

        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }

        // Color leaf nodes orange, and packages white or blue.
        function color(d) {
            return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
        }

        // Toggle children on click.
        function click(d) {
            if (!d3.event.defaultPrevented) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update();
            }
        }

        // Returns a list of all nodes under the root.
        function flatten(root) {
            var nodes = [], i = 0;

            function recurse(node) {
                if (node.children) node.children.forEach(recurse);
                if (!node.id) node.id = ++i;
                nodes.push(node);
            }

            recurse(root);
            return nodes;
        }


    } else if(selected == "second") {

        var link, node;
        var svg;
        var force;
        var width, height, root;
        
        width = 960;
        height = 500;
            
        svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("graph.json", function(error, json) {
            if (error) throw error;
          
            force = d3.layout.force()
                .gravity(0.05)
                .distance(100)
                .charge(-100)
                .size([width, height]);

            force
                .nodes(json.nodes)
                .links(json.links)
                .start();
          
            link = svg.selectAll(".link")
                .data(json.links)
              .enter().append("line")
                .attr("class", "link");
          
            node = svg.selectAll(".node")
                .data(json.nodes)
              .enter().append("g")
                .attr("class", "node")
                .call(force.drag);
          
            node.append("image")
                .attr("xlink:href", "https://github.com/favicon.ico")
                .attr("x", -8)
                .attr("y", -8)
                .attr("width", 16)
                .attr("height", 16);
          
            node.append("text")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });
          
            force.on("tick", function() {
              link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });
          
              node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
            });
          });
    } 
    
    d3.select("#selected-dropdown").text(selected);
})



