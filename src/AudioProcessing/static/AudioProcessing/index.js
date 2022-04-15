$(document).ready(() => {

    var buffers = [];

    // callback function for Filereader
    function callback(data) {
        buffers.push(data);
        console.log(buffers)
    }

    // converts the blob into base64 string
    function getString(blob, callback) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            callback(JSON.stringify(reader.result))
        }
    }

    var device = navigator.mediaDevices.getUserMedia({
        audio: true
    });
    var items = [];
    device.then(stream => {
        var recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            items.push(e.data);

            if (recorder.state == "inactive") {
                var blob = new Blob(items, {
                    type: "audio/webm"
                });

                // display the audio on frontend
                var audio = document.getElementById("audio");
                var mainaudio = document.createElement("audio");
                mainaudio.setAttribute("controls", "controls");
                audio.appendChild(mainaudio);
                mainaudio.innerHTML = '<source src="' + URL.createObjectURL(blob) + '" type="video/webm"/>';
                // -----------------------------

                getString(blob, callback);
            }
        }


        const btn = document.getElementById("record")

        function record() {
            recorder.start();
            $(btn).addClass("clicked");
            setTimeout(() => {
                recorder.stop();
                $(btn).removeClass("clicked");
            }, 2000);
        }

        $(btn).click(function (e) {
            e.preventDefault();
            record();
        });
    })

    function sendToServer() {
        console.log("in sendToServer");
        // logic to send the base64 string to server
        $.post('http://127.0.0.1:8000/save', {
            "audio" : buffers,
        }, function (response) {
            console.log(response)
        });
    }

    var send_btn = document.getElementById("submit_btn")
    $(send_btn).click(function (e) { 
        e.preventDefault();
        sendToServer();
    });
})