var items = [];
var count = 0;
function AddToList(name, status)
{
	var item = {
		name: name,
		status: status,
		preview: "<img id=\"" + count + "\" src=\"assets/images/wait.png\" alt=\"\" />",
		index: count
	};
	
	items.push(item);
	document.getElementById("table_body").innerHTML += BuildHtmlString(item);
	count++;
	return count - 1;
}

function RefreshList()
{
	var list = ""
	for(var i = 0; i < count; i++)
	{
		list += BuildHtmlString(items[i]);
	}
	document.getElementById("table_body").innerHTML = list;
}

function BuildHtmlString(item)
{
	if(item.status == "Failed")
		return "<tr><td>" + item.name + "</td><td><span class=\"label label-danger\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	if(item.status == "Success")
		return "<tr><td>" + item.name + "</td><td><span class=\"label label-success\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	return "<tr><td>" + item.name + "</td><td><span class=\"label label-info\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
}

function ReadImage(file, index) {//file must be a Blob.
	var reader = new FileReader();

	reader.onload = function (e) {
		$("#" + index)
			.attr('src', e.target.result)
			.width(150)
			.height(200);
		//Need to update items
	};

	reader.readAsDataURL(file);
}