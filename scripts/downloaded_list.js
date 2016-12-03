var items = [];
var count = 0;
function AddToList(name, status)//A status of "Failed" will create a red item while a status of "Success" will create a green item.
{
	var item = {
		name: name,
		status: status,
		preview: "<div id=\"#" + count + "\"><image src=\"assets/images/wait.png\" alt=\"\" style=\"max-height:25px\" /></div>",
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

function DisplayPreview(file, index) {
	document.getElementById("#" + index).innerHTML = "";
	file.appendTo("#" + index);
	
	items[index].preview = "<div id=\"#" + count + "\">" + document.getElementById("#" + index).innerHTML + "</div>";

	reader.readAsDataURL(file);
}

function DisplayFile(file)
{
	document.getElementById('ShowSpace').innerHTML = "";
	file.appendTo('ShowSpace', function (err, elem) {
		if (err) throw err // file failed to download or display in the DOM
		console.log('New DOM node with the content', elem)
	});
}