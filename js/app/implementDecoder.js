function decode(){
  var message = document.getElementById('isoMessage').value;

  if( message != ""){


    var len_str = message.length-4;
    console.log("len_str: "+len_str);

    var len_iso = message.substring(0,4)*1;
    console.log("len_iso: "+len_iso);

    if (len_str != len_iso) {
      alert_msj = '<div class="alert alert-warning alert-dismissible masterAlert masterDangerAlert" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><p>Largo del mensaje agregado automaticamente: <strong> '+("0000"+message.length).slice(-4)+' </strong>.</p></div>';
      document.getElementById('alert-place').innerHTML = alert_msj;
      message = ("0000"+message.length).slice(-4)+message;
      console.log("Largo del mensaje agregado automaticamente: "+("0000"+message.length).slice(-4));
    }


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
        isoDecoded = isoDecoded+'<tr><td>'+i+'</td><td>Yes</td><td>'+bitValue[4]+'</td><td><pre>'+bitValue[0]+'</pre></td>'
      };
    };

    document.getElementById('rowDecodedContent').innerHTML = isoDecoded;
  }
  else{
    alert('Not found message to decode. Please insert them.')
  }
}

