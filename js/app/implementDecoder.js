function decode(){
  var message = document.getElementById('isoMessage').value;

  if( message != ""){

    var iso = new Iso8583(message);
    var isoDecoded = "";
    var bitValue = "";

    document.getElementById('msgLength').innerHTML = '<b>Message Length: </b>'+iso.msgLength();
    document.getElementById('mti').innerHTML = '<b>Message Type: </b>'+iso.msgType();
    document.getElementById('bitmap1').innerHTML = '<b>Bitmap 1: </b>'+iso.msgBitmap1();
    document.getElementById('bitmap2').innerHTML = '<b>Bitmap 2: </b>'+iso.msgBitmap2();
    
    document.getElementById('panelTable').className = 'panel panel-success';

    for (var i = 2; i < 128; i++) {
      if (iso.msgDecoded['bit'+i] != null) {
        bitValue = (iso.msgDecoded['bit'+i]).split(":");
        console.log(bitValue);
        isoDecoded = isoDecoded+'<tr><td>'+i+'</td><td>Yes</td><td>'+bitValue[4]+'</td><td><pre>['+bitValue[0]+']</pre></td>'
      };
    };

    document.getElementById('rowDecodedContent').innerHTML = isoDecoded;
  }
  else{
    alert('Not found message to decode. Please insert them.')
  }
}

