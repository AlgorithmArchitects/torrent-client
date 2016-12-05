var items = [];
var count = 0;
var client = new WebTorrent();

function submitDownload(){
	var torrent = $("#torrentlink").val();
	if (checkTorrent(torrent))
    	downloadTorrent(torrent);
}
function downloadTorrent(torrentId){
    client.add(torrentId, function (torrent) {
        console.log(torrent);
        torrent.on('done', function(){
            console.log('torrent finished downloading');
            torrent.files.forEach(function(file){
                file.getBlobURL(function (err, url) {
					var index = GetIndexFromName(file.name)
                    if (err)
					{
						ModifyStatus("Failed", index);
						return log(err.message);
					}
					ModifyStatus("Success", index);
					document.getElementById(index+"Name").href = url;
					document.getElementById(index+"Name").className = "";
                });
            })
        });
        torrent.files.forEach(function(file){
            var index = AddToList(file.name, "In progress: 0%");
			DisplayPreview(file, index);
        });
        torrent.on('download', function (bytes) {
			var progress = (torrent.progress * 100).toFixed(2).toString() + "%";
			console.log(progress);
        	torrent.files.forEach(function(file){
				ModifyStatus("In progress: " + progress, GetIndexFromName(file.name));
        	});
        });
    });
}
function AddToList(name, status)//A status of "Failed" will create a red item while a status of "Success" will create a green item.
{
	var item = {
		name: name,
		status: status,
		preview: "<div id=\"Image" + count + "\"></div>",
		index: count
	};
	items.push(item);
	document.getElementById("table_body").innerHTML += BuildHtmlString(item, count);
	count++;
	return count - 1;
}

function BuildHtmlString(item, index)
{
	if(item.status == "Failed")
		return "<tr><td><a id=\"" + index + "Name\" class=\"inactiveLink\">" + item.name + "</a><td><span class=\"label label-danger\" id = \"" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	if(item.status == "Success")
		return "<tr><td><a id=\"" + index + "Name\" class=\"inactiveLink\">" + item.name + "</a><td><span class=\"label label-success\" id = \"" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	return "<tr><td><a id=\"" + index + "Name\" class=\"inactiveLink\">" + item.name + "</a><td><span class=\"label label-info\" id = \"" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
}

function DisplayPreview(file, index) {//For some reason I can't contain size propperly
	var node = document.getElementById("Image" + index);
	document.getElementById("Image" + index).innerHTML = "";
	file.appendTo(node, function (err, elem) {
		if (err) console.log(err); // file failed to download or display in the DOM
		else console.log('New DOM node with the content', elem);
	});
	
}

function ModifyStatus(status, index)
{
	if(status == "Failed")
		document.getElementById(index + "Status").parentNode.innerHTML = "<span class=\"label label-danger\" id = \"" + index +"Status\">" + status + "</span>";
	else if(status == "Success")
		document.getElementById(index + "Status").parentNode.innerHTML = "<span class=\"label label-success\" id = \"" + index +"Status\">" + status + "</span>";
	else
		document.getElementById(index + "Status").parentNode.innerHTML = "<span class=\"label label-info\" id = \"" + index +"Status\">" + status + "</span>";
	items[index].status = status;
}

function DisplayFile(file)
{
	document.getElementById('ShowSpace').innerHTML = "";
	document.getElementById('ShowSpace').childNodes = [];
	file.appendTo('ShowSpace', function (err, elem) {
		if (err) throw err // file failed to download or display in the DOM
		console.log('New DOM node with the content', elem)
	});
}

function GetIndexFromName(file)
{
	for(var i = 0; i < count; i++)
		if(items[i].name == file)
			return i;
}

function checkTorrent(torrentLink){
	var torrentfield = document.getElementById("torrentlink");
	var formctrl = document.getElementById('form-ctrl');
	var alertbox = document.getElementById("error-alert");
	client.add(torrentLink, function (torrent) {
		client.on('torrent', function (torrent) {})
	});
	if (client.get(torrentLink)){
		// Succes msgs:
		alertbox.style.display="none";
		formctrl.className = "input-group form-group has-success";
		formctrl.childNodes[5].className = 'glyphicon glyphicon-ok form-control-feedback'
		return checkHTMLStorage(setHtmlStorage,'torrentlink',torrentLink);
	}
	else{
		// Error Messages:
		// Alert
		alertbox.innerHTML = "<strong> Invalid Torrent Link</strong>";
		alertbox.style.display="inline-block";
		// Torrent field
		torrentfield.focus();
		formctrl.className = "input-group form-group has-error";
		formctrl.childNodes[5].className = 'glyphicon glyphicon-remove form-control-feedback'
		return false;
	}
}

function checkHTMLStorage(f, key, value){
	if (typeof(Storage) !== "undefined") {
		// Code for localStorage/sessionStorage.
		if (value != ""){
			f(key, value);
		}
		else{
			f(key);
		}
		return true;

	} else {
		alert("No HTML localstorage is supported!");
		return false;
		// TODO: use cookies instead?
	}
}
// Looks pretty useless, but at least it works with checkHTMLStorage...
function setHtmlStorage(key, value){
	localStorage.setItem(key, value);
}
// Looks pretty useless, but at least it works with checkHTMLStorage...
function getHtmlStorage(key){
	return localStorage.getItem(key);
}