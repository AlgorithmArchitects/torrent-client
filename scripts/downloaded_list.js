var items = [];
var count = 0;
function AddToList(name, status, preview)
{
	var item = {
		name: name,
		status: status,
		preview: preview
	};
	
	items.push(item);
	document.getElementById("table_body").innerHTML += BuildHtmlString(item);
	count++;
	return count - 1;
}

function RefreshList()
{
	document.getElementById("table_body").innerHTML = "";
	for(var i = 0; i < count; i++)
	{
		document.getElementById("table_body").innerHTML += BuildHtmlString(items[i]);
	}
}

function BuildHtmlString(item)
{
	if(item.status == "Failed")
		return "<tr><td>" + items[i].name + "</td><td><span class=\"label label-danger\">" + items[i].status + "</span></td><td>" + items[i].preview + "</td></tr>\n";
	if(item.status == "Success")
		return "<tr><td>" + items[i].name + "</td><td><span class=\"label label-success\">" + items[i].status + "</span></td><td>" + items[i].preview + "</td></tr>\n";
	return "<tr><td>" + items[i].name + "</td><td><span class=\"label label-info\">" + items[i].status + "</span></td><td>" + items[i].preview + "</td></tr>\n";
}