/**
 * Created by schott on 03.12.16.
 */
/**
 * Created by schott on 25.09.16.
 */
var client = new WebTorrent();
var files = []; // Keeps track of encountered files
new Clipboard('.clip');  // Copy to clipboard action
client.on('error', function (err) {
    client = new WebTorrent();
    console.log(err)
});
var state = 'stop';
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    //var files = evt.dataTransfer.files;
    // files is a FileList of File objects.
    var count = evt.dataTransfer.files.length;
    var i;
    for (i=0; i < count; i++){
        files.push(evt.dataTransfer.files[i]);
    }
    client.seed(files, function (torrent) {
        console.log('Client is seeding:', torrent.infoHash);
        var output = [];
        for (var i = 0, f; f = files[i]; i++) {
            output.push('<li>Seeding: <strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes',
                '</li>');
        }
        // Update list
        document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        // Update magnet URI
        document.getElementById('uri').value = torrent.magnetURI;
        document.getElementById('uri').style.display = "inline-block";
        document.getElementById('clip-btn').style.display = "inline-block";
        // Show footers
        $('.panel-footer').show();
        // Setup connection updates
        setInterval(onUpload, 300);

        function onUpload(){
            // Progress bar
            document.getElementById("upload-progress")
                .innerHTML = prettyBytes(torrent.uploadSpeed) + '/s' + ' to ' + torrent.numPeers + ' Peers.';
        }
    });
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Human readable bytes util
function prettyBytes(num) {
    var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    if (neg) num = -num
    if (num < 1) return (neg ? '-' : '') + num + ' B'
    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
    num = Number((num / Math.pow(1000, exponent)).toFixed(2))
    unit = units[exponent]
    return (neg ? '-' : '') + num + ' ' + unit
}

// Resume / Stop download
function buttonPlayPress() {
    $('.seeding').show();
    state = 'play';
    console.log("button play pressed, play was "+state);
}

function buttonStopPress(){
    state = 'stop';
    $('.seeding').hide();
    console.log("button stop invoked.");
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);