var items = [];
var count = 0;
var client = new WebTorrent();
var currentPreviewIndex = -1;


function submitDownload(){
	var torrent = $("#torrentlink").val();
	var validComplete = new Promise(function(resolve, reject) {
		checkTorrent(torrent,resolve,reject);
	});

	validComplete.then(function(valid) {
		console.log(valid);
		if (valid){
			$('.collapse').collapse('show');
			downloadTorrent(torrent);
		}
	}, function(err) {
		console.log(err);
	});

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
			items[index].file = file;
        });
		SetupDisplayPreviewButtons();
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
		preview: "<div id=\"Image" + count + "\"><button type = \"button\" id = \"button" + count + "\">Preview</button></div>",
		index: count,
		file: null
	};
	items.push(item);
	var table = document.getElementById("table_body");
	table.innerHTML += BuildHtmlString(item, count);
	count++;
	return count - 1;
}

function BuildHtmlString(item, index)
{
	if(item.status == "Failed")
		return "<tr><td><a id=\"" + index + "Name\" class=\"inactiveLink\">" + item.name + "</a><td><span class=\"label label-danger\" id = \"" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	if(item.status == "Success")
		return "<tr><td><a id=\"" + index + "Name\" target=\"_blank\" class=\"inactiveLink\">" + item.name + "</a><td><span class=\"label label-success\" id = \"" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
	return "<tr><td><a id=\"" + index + "Name\" target=\"_blank\" class=\"inactiveLink\">" + item.name + "</a><td><span class=\"label label-info\" id = \"" + index +"Status\">" + item.status + "</span></td><td>" + item.preview + "</td></tr>\n";
}

function SetupDisplayPreviewButtons() {
	for(var i = 0; i < count; i++)
	{
		node = document.getElementById("button" + i);
		node.onclick = function(evt) {
			var num = evt.srcElement.id;
			num = num.substring(6, num.length);
			if(num != currentPreviewIndex)
				DisplayFile(items[parseInt(num)].file)
		};
	}
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
    console.log(file);
	var elm = document.getElementById('ShowSpace');
	if(elm.firstChild)
		elm.removeChild(elm.firstChild);
	file.appendTo(elm, function (err, elem) {
		if (err) throw err // file failed to download or display in the DOM
		console.log('New DOM node with the content', elem)
	});
	elm.childNodes[0].style.width = "100%";
}

function GetIndexFromName(file)
{
	for(var i = 0; i < count; i++)
		if(items[i].name == file)
			return i;
}

function checkTorrent(torrentLink,resolve,reject){
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
		resolve(true);
		//return checkHTMLStorage(setHtmlStorage,'torrentlink',torrentLink);
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
		reject("Invalid magnet URI: " + torrentfield.val());
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