/**
* @fileoverview Decoder ISO-8583 - Financial transaction card originated messages
* 
* @author Carlos Ananias
* @version 0.1
* 
* @example 
* var iso = new Iso8583(message, configuration);
*/




function Iso8583 (msgsrc, configmsg) {
  this.isoMessage = msgsrc;
  this.bitmap1 = this.msgDecodeBitmap(1);
  this.bitmap2 = this.msgDecodeBitmap(2);
  this.msgDecoded = this.getBitValue(configmsg);
  this.bitInit = 0;
}



Iso8583.prototype.msgDecodeBitmap = function(num) {
  function CheckHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)};
  function Hex2Bin(n){if(!CheckHex(n)) return 0; return parseInt(n,16).toString(2)};

  var btm = "";
  
  if (num == 1){ 
    this.msgBitmap1().split("").forEach( function(entry){
      btm = btm+("000"+Hex2Bin(entry)).slice(-4);
      this.bitInit = 24;
    })
  return btm;
  }

  if(num == 2 && this.bitmap1.split("")[0] == 1){
    this.msgBitmap2().split("").forEach( function(entry){
      btm = btm+("000"+Hex2Bin(entry)).slice(-4);
      this.bitInit = 40;
    })
  return btm;
  }
};



Iso8583.prototype.getBitValue = function(bitconf) {
  var bitEnd = 0;
  var bitValues = {};
  var bitKeys = {};

  if(bitconf == null || Object.keys(bitconf) == "") {
    bitconf = this.defaultIsoConf();
    bitKeys = Object.keys( this.defaultIsoConf() ) ; 
  }else{  
    bitKeys = Object.keys(bitconf);
  }

  for (var i = 0; i < bitKeys.length; i++) {
    if((this.bitmap1+this.bitmap2).split("")[ ((parseInt(bitKeys[i]))-1) ] == 1) {
      switch(bitconf[bitKeys[i]].split(":")[1].toUpperCase()){
        case "FIXED":
          bitEnd = bitInit+parseInt(bitconf[bitKeys[i]].split(":")[2]);
          bitValues["bit"+bitKeys[i]] = "["+this.isoMessage.substring(bitInit,bitEnd)+"]:"+bitconf[bitKeys[i]];
          bitInit = bitEnd;
          break;
        case "LVAR":
          bitEnd = bitInit+parseInt(this.isoMessage.substring(bitInit,bitInit+1))+1;
          bitValues["bit"+bitKeys[i]] = "["+this.isoMessage.substring(bitInit+1,bitEnd)+"]:"+bitconf[bitKeys[i]];
          bitInit = bitEnd;
        case "LLVAR":
          bitEnd = bitInit+parseInt(this.isoMessage.substring(bitInit,bitInit+2))+2;
          bitValues["bit"+bitKeys[i]] = "["+this.isoMessage.substring(bitInit+2,bitEnd)+"]:"+bitconf[bitKeys[i]];
          bitInit = bitEnd;
          break;
        case "LLLVAR":
          bitEnd = bitInit+parseInt(this.isoMessage.substring(bitInit,bitInit+3))+3;
          bitValues["bit"+bitKeys[i]] = "["+this.isoMessage.substring(bitInit+3,bitEnd)+"]:"+bitconf[bitKeys[i]];
          bitInit = bitEnd;
          break;
        case "LLLVAR-TLV":
          bitEnd = bitInit+parseInt(this.isoMessage.substring(bitInit,bitInit+3))+3;
          bitValues["bit"+bitKeys[i]] = this.decodeTLV(this.isoMessage.substring(bitInit+3,bitEnd))+":"+bitconf[bitKeys[i]];
          bitInit = bitEnd;
          break;
      }
    }
  }
  return bitValues;
}; 

Iso8583.prototype.decodeTLV = function(values) {
  var tlvInit = 0;
  var tlvEnd = 0;
  var tlvs = {};
  var name = "";
  var len = "";
  var val = "";
  var a ="";  

  while (values.length > tlvInit ){
    name = values.substring(tlvInit,tlvInit+3);
    len  = values.substring(tlvInit+3,tlvInit+6);
    val  = values.substring(tlvInit+6,tlvInit+6+parseInt(len));

    tlvInit = tlvInit+6+parseInt(len);
    a = a+'\nLTV '+name+'\nLargo '+len+' \nValor ['+val+']\n';
  }
  return a;
};


// Length Message 
Iso8583.prototype.msgLength = function() {
  return this.isoMessage.substring(0,4);
};


// Message Type Indicator
Iso8583.prototype.msgType = function() {
  return this.isoMessage.substring(4,8);
};


//First Bitmap 
Iso8583.prototype.msgBitmap1 = function() {
  return this.isoMessage.substring(8,24);
};


//Bit Map Extended
Iso8583.prototype.msgBitmap2 = function() {
  return this.isoMessage.substring(24,40);
};

Iso8583.prototype.defaultIsoConf = function() {

  var conf = {};
  conf['2'] = "N:LLVAR:19:Primary account number (PAN)";
  conf['3'] = "N:FIXED:6:Processing code";
  conf['4'] = "N:FIXED:12:Amount, transaction";
  conf['5'] = "N:FIXED:12:Amount, Settlement";
  conf['6'] = "N:FIXED:12:Amount, cardholder billing";
  conf['7'] = "N:FIXED:10:Transmission date & time";
  conf['8'] = "N:FIXED:8:Amount, Cardholder billing fee";
  conf['9'] = "N:FIXED:8:Conversion rate, Settlement";
  conf['10'] = "N:FIXED:8:Conversion rate, cardholder billing";
  conf['11'] = "N:FIXED:6:Systems trace audit number";
  conf['12'] = "N:FIXED:6:Time, Local transaction";
  conf['13'] = "N:FIXED:4:Date, Local transaction (MMdd)";
  conf['14'] = "N:FIXED:4:Date, Expiration";
  conf['15'] = "N:FIXED:4:Date, Settlement";
  conf['16'] = "N:FIXED:4:Date, conversion";
  conf['17'] = "N:FIXED:4:Date, capture";
  conf['18'] = "N:FIXED:4:Merchant type";
  conf['19'] = "N:FIXED:3:Acquiring institution country code";
  conf['20'] = "N:FIXED:3:PAN Extended, country code";
  conf['21'] = "N:FIXED:3:Forwarding institution. country code";
  conf['22'] = "N:FIXED:3:Point of service entry mode";
  conf['23'] = "N:FIXED:3:Application PAN number";
  conf['24'] = "N:FIXED:3:Function code(ISO 8583:1993)/Network International identifier (?)";
  conf['25'] = "N:FIXED:2:Point of service condition code";
  conf['26'] = "N:FIXED:2:Point of service capture code";
  conf['27'] = "N:FIXED:1:Authorizing identification response length";
  conf['28'] = "N:FIXED:8:Amount, transaction fee";
  conf['29'] = "N:FIXED:8:Amount. settlement fee";
  conf['30'] = "N:FIXED:8:Amount, transaction processing fee";
  conf['31'] = "N:FIXED:8:Amount, settlement processing fee";
  conf['32'] = "N:LLVAR:11:Acquiring institution identification code";
  conf['33'] = "N:LLVAR:11:Forwarding institution identification code";
  conf['34'] = "N:LLVAR:28:Primary account number, extended";
  conf['35'] = "Z:LLVAR:37:Track 2 data";
  conf['36'] = "N:LLLVAR:104:Track 3 data";
  conf['37'] = "AN:FIXED:12:Retrieval reference number";
  conf['38'] = "AN:FIXED:6:Authorization identification response";
  conf['39'] = "AN:FIXED:2:Response code";
  conf['40'] = "AN:FIXED:3:Service restriction code";
  conf['41'] = "ANS:FIXED:8:Card acceptor terminal identification";
  conf['42'] = "ANS:FIXED:15:Card acceptor identification code";
  conf['43'] = "ANS:FIXED:40:Card acceptor name/location";
  conf['44'] = "AN:LLVAR:25:Additional response data";
  conf['45'] = "AN:LLVAR:76:Track 1 Data";
  conf['46'] = "AN:LLLVAR:999:Additional data - ISO";
  conf['47'] = "AN:LLLVAR:999:Additional data - National";
  conf['48'] = "AN:LLLVAR:999:Additional data - Private";
  conf['49'] = "A:FIXED:3:Currency code, transaction";
  conf['50'] = "AN:FIXED:3:Currency code, settlement";
  conf['51'] = "AN:FIXED:3:Currency code, cardholder billing";
  conf['52'] = "B:FIXED:16:Personal Identification number data";
  conf['53'] = "N:FIXED:18:Security related control information";
  conf['54'] = "AN:LLLVAR:120:Additional amounts";
  conf['55'] = "ANS:LLLVAR:999:Reserved ISO";
  conf['56'] = "ANS:LLLVAR:999:Reserved ISO";
  conf['57'] = "ANS:LLLVAR:999:Reserved National";
  conf['58'] = "ANS:LLLVAR:999:Reserved National";
  conf['59'] = "ANS:LLLVAR:999:Reserved for national use";
  conf['60'] = "AN:LLLVAR:7:Advice/reason code (private reserved)";
  conf['61'] = "ANS:LLLVAR:999:Reserved Private";
  conf['62'] = "ANS:LLLVAR:999:Reserved Private";
  conf['63'] = "ANS:LLLVAR:999:Reserved Private";
  conf['64'] = "B:FIXED:16:Message authentication code (MAC)";
  conf['65'] = "B:FIXED:16:Bit map, tertiary";
  conf['66'] = "N:FIXED:1:Settlement code";
  conf['67'] = "N:FIXED:2:Extended payment code";
  conf['68'] = "N:FIXED:3:Receiving institution country code";
  conf['69'] = "N:FIXED:3:Settlement institution county code";
  conf['70'] = "N:FIXED:3:Network management Information code";
  conf['71'] = "N:FIXED:4:Message number";
  conf['72'] = "ANS:LLLVAR:999:Data record (ISO 8583:1993)/n 4 Message number, last(?)";
  conf['73'] = "N:FIXED:6:Date, Action";
  conf['74'] = "N:FIXED:10:Credits, number";
  conf['75'] = "N:FIXED:10:Credits, reversal number";
  conf['76'] = "N:FIXED:10:Debits, number";
  conf['77'] = "N:FIXED:10:Debits, reversal number";
  conf['78'] = "N:FIXED:10:Transfer number";
  conf['79'] = "N:FIXED:10:Transfer, reversal number";
  conf['80'] = "N:FIXED:10:Inquiries number";
  conf['81'] = "N:FIXED:10:Authorizations, number";
  conf['82'] = "N:FIXED:12:Credits, processing fee amount";
  conf['83'] = "N:FIXED:12:Credits, transaction fee amount";
  conf['84'] = "N:FIXED:12:Debits, processing fee amount";
  conf['85'] = "N:FIXED:12:Debits, transaction fee amount";
  conf['86'] = "N:FIXED:15:Credits, amount";
  conf['87'] = "N:FIXED:15:Credits, reversal amount";
  conf['88'] = "N:FIXED:15:Debits, amount";
  conf['89'] = "N:FIXED:15:Debits, reversal amount";
  conf['90'] = "N:FIXED:42:Original data elements";
  conf['91'] = "AN:FIXED:1:File update code";
  conf['92'] = "N:FIXED:2:File security code";
  conf['93'] = "N:FIXED:5:Response indicator";
  conf['94'] = "AN:FIXED:7:Service indicator";
  conf['95'] = "AN:FIXED:42:Replacement amounts";
  conf['96'] = "AN:FIXED:8:Message security code";
  conf['97'] = "N:FIXED:16:Amount, net settlement";
  conf['98'] = "ANS:FIXED:25:Payee";
  conf['99'] = "N:LLVAR:11:Settlement institution identification code";
  conf['100'] = "N:LLVAR:11:Receiving institution identification code";
  conf['101'] = "ANS:LLVAR:17:File name";
  conf['102'] = "ANS:LLVAR:28:Account identification 1";
  conf['103'] = "ANS:LLVAR:28:Account identification 2";
  conf['104'] = "ANS:LLLVAR:100:Transaction description";
  conf['105'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['106'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['107'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['108'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['109'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['110'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['111'] = "ANS:LLLVAR:999:Reserved for ISO use";
  conf['112'] = "ANS:LLLVAR:999:Reserved for national use";
  conf['113'] = "N:LLVAR:11:Authorizing agent institution id code";
  conf['114'] = "ANS:LLLVAR-TLV:999:Reserved for national use";
  conf['115'] = "ANS:LLLVAR-TLV:999:Reserved for national use";
  conf['116'] = "ANS:LLLVAR:999:Reserved for national use";
  conf['117'] = "ANS:LLLVAR:999:Reserved for national use";
  conf['118'] = "ANS:LLLVAR:999:Reserved for national use";
  conf['119'] = "ANS:LLLVAR:999:Reserved for national use";
  conf['120'] = "ANS:LLLVAR:999:Reserved for private use";
  conf['121'] = "ANS:LLLVAR:999:Reserved for private use";
  conf['122'] = "ANS:LLLVAR:999:Reserved for private use";
  conf['123'] = "ANS:LLLVAR:999:Reserved for private use";
  conf['124'] = "ANS:LLLVAR:255:Info Text";
  conf['125'] = "ANS:LLLVAR:50:Network management information";
  conf['126'] = "ANS:LLLVAR:6:Issuer trace id";
  conf['127'] = "ANS:LLLVAR:999:Reserved for private use";
  conf['128'] = "B:FIXED:16:Message Authentication code";

  return conf;
};
