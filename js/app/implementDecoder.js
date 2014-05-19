function decode(){
  var message = document.getElementById('isoMessage').value;

  if( message != ""){

    var iso = new Iso8583(message);
    document.getElementById('isoLength').value = iso.msgLength();
    document.getElementById('messageType').value = iso.msgType();  
  
  }
  else{

    alert("Please, Insert a ISO Message...")   
  
  }
}