function decode(){
  var message = document.getElementById('isoMessage').value;

  if( message != ""){

    var iso = new Iso8583(message);

    document.getElementById('msgLength').innerHTML = '<b>Message Length: </b>'+iso.msgLength();
    document.getElementById('mti').innerHTML = '<b>Message Type: </b>'+iso.msgType();
    document.getElementById('bitmap1').innerHTML = '<b>Bitmap 1: </b>'+iso.msgBitmap1();
    document.getElementById('bitmap2').innerHTML = '<b>Bitmap 2: </b>'+iso.msgBitmap2();
    document.getElementById('rowDecodedContent').innerHTML = '<tr><td>2</td><td>Yes</td><td>Primary account number (PAN)</td><td>'+iso.msgDecoded.bit2+'</td></tr>';


  
  }
  else{

    alert('Not found message to decode. Please insert them.')
  
  }
}