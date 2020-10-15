
// This class is the main class for agents, including protocol agents
// and the attacker

class Agent {
    constructor(id, fact_list, network) {
	this.id = id;
	this.msg_stack = [];
	this.network = network;
	this.state = 'init';
	this.decryption_attempt = 0;
	this.facts = [];
	for (var i = 0; i < fact_list.length; i++) {
	    this.learns(fact_list[i], 0);
	}	
    }


    // By default, no need to initialise, can be overriden. 
    init () {
		throw "Agent " + this.id + " cannot initiate this protocol";
    }

    createDiv (outer, c) {
	var main = document.createElement('div');
	main.setAttribute('id', 'agent' + this.id);
	main.setAttribute('class', c);
	var title = document.createElement('h2');
	
	// title.innerHTML = this.id.replace(/\d+/g,'');
	title.innerHTML = this.id;
	main.appendChild(title);
	
	var content = document.createElement('div');
	// TODO check for uniqueness
	content.setAttribute('id', 'agent' + this.id + '_content');
	content.setAttribute('class', 'agent_content');
	main.appendChild(content);
	var d = document.getElementById(outer);
	d.appendChild(main);

	this.updateContent();
	
    }

    updateContent() {
	var content = document.getElementById('agent' + this.id + '_content');
	// Remove all previous content
	while (content.firstChild) {
	    content.removeChild(content.firstChild);
	}
	
	var k = document.createElement('b');
	k.innerHTML = 'Knows:'; 
	
    	var facts_str = '';
    	for (var i = 0; i < this.facts.length; i++)
    	    facts_str += this.facts[i] + ', ';
    	if (this.facts.length > 0)
    	    facts_str = facts_str.substring(0, facts_str.length - 2);
	
	content.appendChild(k);
	for (var i = 0; i < this.facts.length; i++) {
	    var f = this.facts[i];
	    content.appendChild(f.createSpan());
	    if (i < this.facts.length - 1)
		content.appendChild (document.createTextNode (", "));
	}
	content.scrollTop = content.scrollHeight;
 
    }
    
    // Must be overridden in subclasses.  
    process (msg) {
	throw 'Undefined process function';
    }

    // Returns the fact if the agent knows str, null otherwise
    // This construction enables the possibility to consider facts
    // with additional information (e.g., source), although not currently
    // implemented. 
    knows (str) {
	for (var i = 0; i < this.facts.length; i++) {
	    if (this.facts[i].str == str)
		return this.facts[i];
	}

	
	return null;
    }

    // Add the fact str to the list of fact, if not already known. 
    learns (str, step) {
	var facts = str.getFacts();
	for (var i = 0; i < facts.length; i++)
	    if (this.knows(facts[i]) == null) {
		var f = new Fact(facts[i], step);
		this.facts.push(f);
	    }
    }

    // Remove all facts higher than the given steps 
    forgets (step) {
	var new_facts = []; 
	for (var i = 0; i < this.facts.length; i++) {
	    if (this.facts[i].step <= step)
		new_facts.push(this.facts[i]);
	}
	this.facts = new_facts;	
    }
    

    // Tries to decrypt str with key, the agent must know both str and key
    // If successful, then learns the plaintext. 
    decrypt(str, key, step) {
	var str_fact = this.knows(str);
	var key_fact = this.knows(key);

	if (! str.isEncrypted()) {
	    throw 'Agent: ' + this.id +  ' is trying to decrypt non encrypted message: ' + str;
	}
	
	if (str_fact != null) {
	    if (key_fact != null) {
			var plain = str_fact.decrypt(key);
			this.learns(plain, step);
			return plain;
		}
	    else
		throw 'Agent: ' + this.id + ': unknown key: ' + key;
	} else 
	    throw 'Agent: ' + this.id + ': unknown str: ' + str;
    }

    // Tries to encrypt str with key, the agent must know both str and key
    // If successful, then learns the cipher-text. 
    encrypt(str, key, step){
	var str_fact = this.knows(str);
	var key_fact = this.knows(key);
	
	if (str_fact != null) {
	    if (key_fact != null) {
		var cipher = str_fact.encrypt(key);
		this.learns(cipher, step);
		return cipher;
	    }
	    else
		throw 'Agent: ' + this.id + ': unknown key: ' + key;
	} else 
	    throw 'Agent: ' + this.id + ': unknown str: ' + str;
    }

    // Tries to encrypt str with key, the agent must know both str and key
    // If successful, then learns the cipher-text. 
    encryptList(l, key, step){
	
	var key_fact = this.knows(key);
	if (key_fact == null)
	    throw 'Encryption failed, agent: ' + this.id + ' does not know key: ' + key;

	var plain_str = "";
	for (var i = 0; i < l.length; i++) {
	    var str_fact = this.knows(l[i]);
	    
	    if (str_fact == null) 
		throw 'Encryption failed, agent: ' + this.id + ' does not know fact: ' + str_fact;	    
	    plain_str += (i == 0 ? '' : ', ') + l[i];
	}
	
	var plain_fact = new Fact(plain_str, step);
	var cipher = plain_fact.encrypt(key);
	this.learns(cipher, step);
	return cipher;
    }

    // Receives a message, learns all the facts, and processes the message. 
    receive (msg, step) {
	// Removing the learn by default
	// var array = msg.content.getFacts();
	// for (var i = 0; i < array.length; i++)
	//     this.learns(array[i].trim(), step);
	this.process(msg, step);
    }
    
    // Send a message to the network, the agent must know all the sent facts.
    sendMessage (msg, step) {
	var facts = msg.content.getFacts();
	for (var i = 0; i < facts.length; i++) {
	    var fact = this.knows(facts[i].trim());
	    if (fact == null)
		throw 'Agent: '+ this.id + ': unknown fact: ' + facts[i].trim();
	}
	this.network.addMessage(msg, step, 'w');	
    }
    
    
    // refresh () {
    // 	var facts_str = '';
    // 	for (var i = 0; i < this.facts.length; i++)
    // 	    facts_str += this.facts[i] + ', ';
    // 	if (this.facts.length > 0)
    // 	    facts_str = facts_str.substring(0, facts_str.length - 2);
    // 	change_value('facts' + this.id, '<b>Facts:</b> ' + facts_str );

    // 	if (this.state != null)
    // 	    change_value('state' + this.id, '<b>State:</b> ' + this.state);
	
    // }

    // decrypt_all first collects all keys, and then tries to decrypt all
    // known facts
    // Should not be used directly. 
    decrypt_all () {
	console.log('Should not be directly used');
    	this.decryption_attempt++;
    	var keys = []
    	for (var i = 0; i < this.facts.length; i++){
    	    var data = this.facts[i];
    	    if (! data.is_encrypted())
    		keys.push(data)
    	}

    	var plains = []
	
    	for (var i = 0 ; i < keys.length; i++) {
    	    var key = keys[i];
    	    for (var j = 0; j < this.facts.length; j++) {
    		var str = this.facts[j];
    		try {
    		    if (is_encrypted(str)) {
    			var plain = this.decrypt(str, key);
    			plains.push(new Data(plain, this.facts[j].id));
    		    }
    		} catch(err) {
    		    console.log("Cannot decryt " + str + " with key " + key);
    		}
    	    }
    	}
	
	// XXX: The code below might need to be simplified, legacy. 
    	for (var i = 0; i < plains.length; i++) {
    	    var found = false;
    	    for (var j = 0; j < this.facts.length; j++) {
    		if (this.facts[j] == plains[i]) {
    		    found = true;
    		    break;
    		}
    	    }

    	    if (! found) { 
    		this.facts.push(plains[i]);
    		refresh_state();
    		return true;
    	    } else {
    		this.decryption_attempt = 0;
    	    }
    	}
	
    }
}




