function server_secret()
{   
	var step2=document.getElementById("myli").innerHTML.replace(/\s+/g, '');
	var replace_inject;
    
    switch(step2){
    	case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,{K}K"+b1.id+"S}K"+a1.id+"S": //Nonce
    	replace_inject="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+","+"N"+e1.id+");"
    	break;
        
        case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,"+b1.id+",{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //Needham Schroeder
        replace_inject="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+","+"N"+e1.id+");"
        break;


    	default:
    	replace_inject="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+");"
    }
	var s="new_session();transmit(0);transmit(1);intercept(2);"+replace_inject+"transmit(3);transmit(4);"
    return s
}


// middle in the man attack
function freshkey_secret()
{   

    var step2=document.getElementById("myli").innerHTML.replace(/\s+/g, '');
    var replace_intercept="";
    var replace_decrypt;
    var replace_inject="inject("+a1.id+"->"+v1.id+":"+a1.id+","+e1.id+");"
    var s;

    switch(step2){
    	case  "S-&gt;"+a1.id+":{K"+b1.id+"S}K"+a1.id+"S": //server work
        replace_decrypt="decrypt({s_1}K"+e1.id+"S, K"+e1.id+"S);";
        s="new_session();"+replace_intercept+replace_inject+"transmit(1);transmit(2);intercept(3);"+replace_decrypt;
        break;

    	case "S-&gt;"+a1.id+":{#K,{K}K"+b1.id+"S}K"+a1.id+"S": //fresh key work
        replace_decrypt="decrypt({K_0}K"+e1.id+"S, K"+e1.id+"S);decrypt({s_1}K_0, K_0);"
        s="new_session();"+replace_intercept+replace_inject+"transmit(1);transmit(2);intercept(3);"+replace_decrypt;
        break;

        case  "S-&gt;"+a1.id+":{#K,"+b1.id+",{K}K"+b1.id+"S}K"+a1.id+"S": //Identity recipient (not work)
        s="new_session();"+replace_inject+"transmit(1);transmit(2);"
        break;

        case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,{K}K"+b1.id+"S}K"+a1.id+"S": //Nonce work
        replace_intercept="intercept(0);";
        replace_decrypt="decrypt({K_0}K"+e1.id+"S, K"+e1.id+"S);decrypt({s_1}K_0, K_0);";
        replace_inject="inject("+a1.id+"->"+v1.id+":"+a1.id+", "+e1.id+", N"+a1.id+"_1);"
        s="new_session();"+replace_intercept+replace_inject+"transmit(1);transmit(2);intercept(3);"+replace_decrypt;
        break;

        case "S-&gt;"+a1.id+":{#K,{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //identity Sender work
        replace_decrypt="decrypt({K_0, "+a1.id+"}K"+e1.id+"S, K"+e1.id+"S;decrypt({s_1}K_0, K_0);"
        s="new_session();"+replace_intercept+replace_inject+"transmit(1);transmit(2);intercept(3);"+replace_decrypt;
        break;

        case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,"+b1.id+",{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //Needham Schroeder (not work)
        s="new_session();intercept(0);inject("+a1.id+"->"+v1.id+":" +a1.id+", "+e1.id+", "+"N"+a1.id+"_1);transmit(1);transmit(2);";
        break;
    }
	
	return s;
}

/*
This function would test Server,FreshKey,Identity Recipient and Nonce protocol's 
"B knows fake" attack mode. Would try the same mode but automatically replace the message automatically
Those four protocols have the same mode in this attack.
*/
function freshkey_fake()
{   
	
    var step2=document.getElementById("myli").innerHTML.replace(/\s+/g, '');
    
    var replace_decrypt;
    var replace_inject1;
	var replace_inject2;
	var replace_encrypt;
	var f;

    switch(step2){
      
      case "S-&gt;"+a1.id+":{K"+b1.id+"S}K"+a1.id+"S": //server
      replace_inject2="inject("+a1.id+"->"+b1.id+":{fake}K"+b1.id+"S);"
      replace_encrypt="encrypt(fake,K"+b1.id+"S);"
      replace_decrypt="decrypt({K"+b1.id+"S}K"+e1.id+"S, K"+e1.id+"S);"
      replace_inject1="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+");"
      f=replace_inject1+"transmit(0);transmit(1);"+replace_decrypt+replace_encrypt+replace_inject2+";transmit(2);"
      break;
      
      case "S-&gt;"+a1.id+":{#K,{K}K"+b1.id+"S}K"+a1.id+"S": //fresh key
      replace_inject2="inject("+a1.id+"->"+b1.id+":{K_0}K"+b1.id+"S, {fake}K_0);"
      replace_encrypt="encrypt(fake, K_0);"
      replace_decrypt="decrypt({K_0, {K_0}K"+b1.id+"S}K"+e1.id+"S, K"+e1.id+"S);"
      replace_inject1="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+");"
      f=replace_inject1+"transmit(0);transmit(1);"+replace_decrypt+replace_encrypt+replace_inject2+";transmit(2);"
      break;

      case "S-&gt;"+a1.id+":{#K,"+b1.id+",{K}K"+b1.id+"S}K"+a1.id+"S":  //identity recipient
      replace_inject2="inject("+a1.id+"->"+b1.id+":{K_0}K"+b1.id+"S, {fake}K_0)";
      replace_encrypt="encrypt(fake,K_0);"
      replace_decrypt="decrypt({K_0, "+b1.id+", {K_0}K"+b1.id+"S}K"+e1.id+"S, K"+e1.id+"S);"
      replace_inject1="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+");"
      f=replace_inject1+"transmit(0);transmit(1);"+replace_decrypt+replace_encrypt+replace_inject2+";transmit(2);"
      break;
      
      case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,{K}K"+b1.id+"S}K"+a1.id+"S": //Nonce
      replace_inject2="inject("+a1.id+"->"+b1.id+":{K_0}K"+b1.id+"S, {fake}K_0);"
      replace_encrypt="encrypt(fake, K_0);"
      replace_decrypt="decrypt({N"+e1.id+", K_0, {K_0}K"+b1.id+"S}K"+e1.id+"S, K"+e1.id+"S);"
      replace_inject1="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+","+"N"+e1.id+");"
      f=replace_inject1+"transmit(0);transmit(1);"+replace_decrypt+replace_encrypt+replace_inject2+";transmit(2);"
      break;

      case "S-&gt;"+a1.id+":{#K,{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //Identity Sender (not work)
      f="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+");transmit(0);transmit(1);decrypt({K_0, {K_0, "+e1.id+"}K"+b1.id+"S}K"+e1.id+"S, K"+e1.id+"S);encrypt(fake, K"+b1.id+"S);";
      break;

      case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,"+b1.id+",{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //Needham Schroeder (not work)
      f="inject("+e1.id+"->"+v1.id+":"+e1.id+","+b1.id+", "+"N"+e1.id+");transmit(0);transmit(1);decrypt({N"+e1.id+", K_0, "+b1.id+", {K_0, "+e1.id+"}K"+b1.id+"S}K"+e1.id+"S, K"+e1.id+"S);encrypt(fake, K_0);inject("+a1.id+"->"+b1.id+":{K_0, "+e1.id+"}K"+b1.id+"S, {fake}K_0);transmit(2);"
      break;

     }
       
    

    return f;
}



function identityRecipient_secret()
{
	var step2=document.getElementById("myli").innerHTML.replace(/\s+/g, '');
    var replace_inject;
    var s;
    
    switch(step2){
    	
    	case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,{K}K"+b1.id+"S}K"+a1.id+"S": //Nonce(not work)
        s="new_session();transmit(0);intercept(1);transmit(1);new_session();compromise(K_0);inject("+v1.id+"->"+a1.id+":{N"+a1.id+"_1, K_0, {K_0}K"+b1.id+"S}K"+a1.id+"S);transmit(4);"
        break;

    	case "S-&gt;"+a1.id+"#K,{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //identit sender 
        replace_inject="inject("+v1.id+"->"+a1.id+":{K_0, {K_0, "+a1.id+"}K"+b1.id+"S}K"+ai.id+"S);"
        s="new_session();transmit(0);intercept(1);transmit(1);new_session();compromise(K_0);"+replace_inject+"transmit(4);intercept(5);decrypt({s_2}K_0, K_0)"
        break;
        
         case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,"+b1.id+",{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //NS（notwork）
        s="new_session();transmit(0);intercept(1);transmit(1);new_session();compromise(K_0);inject("+v1.id+"->"+a1.id+":{N"+a1.id+"_1, K_0, "+b1.id+", {K_0, "+a1.id+"}K"+b1.id+"S}K"+a1.id+"S);transmit(4);"
        break;
        
        case "S-&gt;"+a1.id+":{#K,"+b1.id+",{K}K"+b1.id+"S}K"+a1.id+"S":  //identity recipient
        s="new_session();transmit(0);intercept(1);transmit(1);new_session();compromise(K_0);inject("+v1.id+"->"+a1.id+":{K_0, "+b1.id+", {K_0}K"+b1.id+"S}K"+a1.id+"S);transmit(4);intercept(5);decrypt({s_2}K_0, K_0);"
        break;
        
    
        
        default:
        s="new_session();transmit(0);intercept(1);transmit(1);new_session();compromise(K_0);";
    }

    
    return s;
}


/*apply to Nonce, Identity recipeint, ideneity sender and needgam. Same mode.
*/
function identitySender_fake()
{
	var step2=document.getElementById("myli").innerHTML.replace(/\s+/g, '');
	var f;
	switch(step2){
     case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,{K}K"+b1.id+"S}K"+a1.id+"S": //Nonce
     f="new_session();transmit(0);transmit(1);intercept(2);new_session();compromise(K_0);encrypt(fake, K_0);inject("+a1.id+"->"+b1.id+":{K_0}K"+b1.id+"S, {fake}K_0);transmit(4);"
     break;

     case "S-&gt;"+a1.id+":{#K,"+b1.id+",{K}K"+b1.id+"S}K"+a1.id+"S":  //identity recipient
     f="new_session();transmit(0);transmit(1);intercept(2);new_session();compromise(K_0);encrypt(fake, K_0);inject("+a1.id+"->"+b1.id+":{K_0}K"+b1.id+"S, {fake}K_0);transmit(4);"
     break;
     
     case "S-&gt;"+a1.id+"#K,{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S": //identit sender 
     f="new_session();transmit(0);transmit(1);intercept(2);new_session();compromise(K_0);encrypt(fake, K_0);inject("+a1.id+"->"+b1.id+":{K_0, "+a1.id+"}K"+b1.id+"S, {fake}K_0);transmit(4);"
     break;

     case "S-&gt;"+a1.id+":{#N"+a1.id+",#K,"+b1.id+",{K,"+a1.id+"}K"+b1.id+"S}K"+a1.id+"S"://Needham Schroeder 
     f="new_session();transmit(0);transmit(1);intercept(2);new_session();compromise(K_0);encrypt(fake, K_0);inject("+a1.id+"->"+b1.id+":{K_0, "+a1.id+"}K"+b1.id+"S, {fake}K_0);transmit(4);"
     break;
     
     default:
     f="new_session();transmit(0);transmit(1);intercept(2);new_session();compromise(K_0);"
	}

	return f;
}

function nss(){
	document.getElementById("ns").innerHTML="It should not be possible for E to know the session secret."
}

