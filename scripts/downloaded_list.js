var items = [];
var count = 0;
var client = new WebTorrent();

function submitDownload(){
    console.log('submitted');
    downloadTorrent($("#torrentlink").val());
}
function downloadTorrent(torrentId){
    client.add(torrentId, function (torrent) {
        console.log(torrent);
        torrent.on('done', function(){
            console.log('torrent finished downloading');
            torrent.files.forEach(function(file){
                file.getBlobURL(function (err, url) {
                    if (err) return log(err.message);
                    console.log(url);
                     var a = document.createElement("a");
                     document.body.appendChild(a);
                     a.style = "display: none";
                     a.href = url;
                     a.download = file.name;
                     a.click();
                     window.URL.revokeObjectURL(url);
                });
            })
        });
        torrent.on('download', function (bytes) {
            console.log('just downloaded: ' + bytes);
            console.log('total downloaded: ' + torrent.downloaded);
            console.log('download speed: ' + torrent.downloadSpeed);
            console.log('progress: ' + torrent.progress);
        });
        var file = torrent.files[0]
        AddToList(file.name, "in progress");
    });
}
function AddToList(name, status)//A status of "Failed" will create a red item while a status of "Success" will create a green item.
{
	var item = {
		name: name,
		status: status,
		preview: "<div id=\"#" + count + "Image\"><image src=\"assets/images/wait.png\" alt=\"\" style=\"max-height:25px\" /></div>",
		index: count
	};
	items.push(item);
	document.getElementById("table_body").innerHTML += BuildHtmlString(item, count);
	count++;
	return count - 1;
}

function RefreshList()
{
	var list = ""
	for(var i = 0; i < count; i++)
	{
		list += BuildHtmlString(items[i], count);
	}
	document.getElementById("table_body").innerHTML = list;
}

function BuildHtmlString(item, index)
{
	if(item.status == "Failed")
		return "<tr><td>" + item.name + "</td><td><span class=\"label label-danger\" id = \"#" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	if(item.status == "Success")
		return "<tr><td>" + item.name + "</td><td><span class=\"label label-success\" id = \"#" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	return "<tr><td>" + item.name + "</td><td><span class=\"label label-info\" id = \"#" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
}

function DisplayPreview(file, index) {
	document.getElementById("#" + index + "Image").innerHTML = "";
	file.appendTo("#" + index, {autoplay: false}, function (err, elem) {
		if (err) console.log(err); // file failed to download or display in the DOM
		else console.log('New DOM node with the content', elem);
	});
	
	items[index].preview = "<div id=\"#" + count + "Image\">" + document.getElementById("#" + index + "Image").innerHTML + "</div>";
}

function ModifyStatus(status, index)
{
	if(status == "Failed")
		document.getElementById("#" + index + "Status").parentNode.innerHTML = "<span class=\"label label-danger\" id = \"#" + index +"status\">" + status + "</span>";
	else if(status == "Success")
		document.getElementById("#" + index + "Status").parentNode.innerHTML = "<span class=\"label label-success\" id = \"#" + index +"status\">" + status + "</span>";
	else
		document.getElementById("#" + index + "Status").parentNode.innerHTML = "<span class=\"label label-info\" id = \"#" + index +"status\">" + status + "</span>";
	items[index].status = status;
}

function DisplayFile(file)
{
	document.getElementById('ShowSpace').innerHTML = "";
	file.appendTo('ShowSpace', function (err, elem) {
		if (err) throw err // file failed to download or display in the DOM
		console.log('New DOM node with the content', elem)
	});
}
