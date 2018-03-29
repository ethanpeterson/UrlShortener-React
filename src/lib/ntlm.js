/*
	Original source can be found at: https://gist.github.com/andypols/5513270
*/

var url = require('url');
var crypto = require('crypto');

/*
 NTLM PROCESS FOR GET REQUESTS:
 ==============================

 STEP 1: The Client requests a protected resource from the server
 STEP 2: The Server responds with a 401 status, with a header indicating that the client must authenticate
 STEP 3: The Client resubmits the request with an Authorization header containing a Base-64 encoded Type 1 message.  From this point forward, the connection is kept open; closing the connection requires reauthentication of subsequent requests.
 STEP 4: The Server replies with a 401 status containing a Base-64 encoded Type 2 message in the WWW-Authenticate header
 STEP 5: The Client responds to the Type 2 message by resubmitting the request with an Authorization header containing a Base-64 encoded Type 3 message
 STEP 6: Finally, the Server validates the responses in the client's Type 3 message and allows access to the resource.

 NTLM PROCESS FOR POST REQUESTS:
 ===============================

 STEP 1: The Client submit an empty POST request with a Type 1 message in the "Authorization" header
 STEP 2: The Server replies with a 401 status containing a Base-64 encoded Type 2 message in the WWW-Authenticate header
 STEP 3: The Client resubmits the POST with a Base-64 encoded Type 3 message Type 3 message, sending the data payload with the request.
 */

function decodeType2(buf) {
	var proto = buf.toString('ascii', 0, 7);
	if (buf[7] !== 0x00 || proto !== 'NTLMSSP') {
		throw new Error('magic was not NTLMSSP');
	}

	var type = buf.readUInt8(8);
	if (type !== 0x02) {
		throw new Error('message was not NTLMSSP type 0x02');
	}

	return buf.slice(24, 32);
}

function oddpar(buf) {
	for (var j = 0; j < buf.length; j++) {
		var par = 1;
		for (var i = 1; i < 8; i++) {
			par = (par + (buf[j] >> i & 1)) % 2;
		}
		buf[j] |= par & 1;
	}
	return buf;
}

/*
 * Expand a 56-bit key buffer to the full 64-bits for DES.
 *
 * Based on code sample in:
 *    http://www.innovation.ch/personal/ronald/ntlm.html
 */
function expandkey(key56) {
	var key64 = new Buffer(8);

	key64[0] = key56[0] & 0xFE;
	key64[1] = key56[0] << 7 & 0xFF | key56[1] >> 1;
	key64[2] = key56[1] << 6 & 0xFF | key56[2] >> 2;
	key64[3] = key56[2] << 5 & 0xFF | key56[3] >> 3;
	key64[4] = key56[3] << 4 & 0xFF | key56[4] >> 4;
	key64[5] = key56[4] << 3 & 0xFF | key56[5] >> 5;
	key64[6] = key56[5] << 2 & 0xFF | key56[6] >> 6;
	key64[7] = key56[6] << 1 & 0xFF;

	return key64;
}

function lmhashbuf(inputstr) {
	/* ASCII --> uppercase */
	var x = inputstr.substring(0, 14).toUpperCase();
	var xl = Buffer.byteLength(x, 'ascii');

	/* null pad to 14 bytes */
	var y = new Buffer(14);
	y.write(x, 0, xl, 'ascii');
	y.fill(0, xl);

	/* insert odd parity bits in key */
	var halves = [
		oddpar(expandkey(y.slice(0, 7))),
		oddpar(expandkey(y.slice(7, 14)))
	];

	/* DES encrypt magic number "KGS!@#$%" to two 8-byte ciphertexts, (ECB, no padding) */
	var buf = new Buffer(16);
	var pos = 0;
	var cts = halves.forEach(function (z) {
		var key = z; //.toString('binary');
		var des = crypto.createCipheriv('DES-ECB', key, '');
		var str = des.update('KGS!@#$%', 'binary', 'binary');
		buf.write(str, pos, pos + 8, 'binary');
		pos += 8;
	});

	/* concat the two ciphertexts to form 16byte value, the LM hash */
	return buf;
}

function nthashbuf(str) {
	/* take MD4 hash of UCS-2 encoded password */
	var ucs2 = new Buffer(str, 'ucs2');
	var md4 = crypto.createHash('md4');
	md4.update(ucs2);
	return new Buffer(md4.digest('binary'), 'binary');
}

function makeResponse(hash, nonce) {
	var out = new Buffer(24);
	for (var i = 0; i < 3; i++) {
		var keybuf = oddpar(expandkey(hash.slice(i * 7, i * 7 + 7)));
		var key = keybuf; //.toString('binary');
		var des = crypto.createCipheriv('DES-ECB', key, '');
		var str = des.update(nonce.toString('binary'), 'binary', 'binary');
		out.write(str, i * 8, i * 8 + 8, 'binary');
	}
	return out;
}

function write16Bits(buf, ntdomainlen, pos) {
	buf.writeUInt16LE(ntdomainlen, pos);
	return pos + 2;
}

function writeNtlmProtocolMarker(buf, messageType) {
	buf.write('NTLMSSP', 0, 7, 'ascii'); // byte protocol[8];
	buf.writeUInt8(0, 7);
	buf.writeUInt8(messageType, 8);
	buf.fill(0x00, 9, 12);
	return 12;
}

function writePadding(buf, pos, quantity) {
	buf.fill(0x00, pos, pos + quantity);
	return pos + quantity;
}

module.exports = {

	type1Message: function (endpoint, ntdomain) {
		ntdomain = ntdomain.toUpperCase();
		var hostname = url.parse(endpoint).hostname.toUpperCase();
		var hostnamelen = Buffer.byteLength(hostname, 'ascii');
		var ntdomainlen = Buffer.byteLength(ntdomain, 'ascii');
		var ntdomainoff = 0x20 + hostnamelen;

		var buf = new Buffer(32 + hostnamelen + ntdomainlen);
		var pos = writeNtlmProtocolMarker(buf, 0x01);
		pos = write16Bits(buf, 0xb203, pos);       // short flags;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, ntdomainlen, pos);  // short dom_len;
		pos = write16Bits(buf, ntdomainlen, pos);  // short dom_len;
		pos = write16Bits(buf, ntdomainoff, pos);  // short dom_off;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, hostnamelen, pos);  // short host_len
		pos = write16Bits(buf, hostnamelen, pos);  // short host_len
		pos = write16Bits(buf, 0x20, pos);         // short host_off
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		buf.write(hostname, 0x20, hostnamelen, 'ascii');
		buf.write(ntdomain, ntdomainoff, ntdomainlen, 'ascii');

		return buf.toString('base64');
	},

	type3Message: function (endpoint, username, password, ntdomain, response) {
		var typeTwoMessage = response.headers['www-authenticate'].split(' ')[1];
		var nonce = decodeType2(new Buffer(typeTwoMessage, 'base64'));

		ntdomain = ntdomain.toUpperCase();
		var hostname = url.parse(endpoint).hostname.toUpperCase();
		var lmh = new Buffer(21);
		lmhashbuf(password).copy(lmh);
		lmh.fill(0x00, 16); // null pad to 21 bytes
		var nth = new Buffer(21);
		nthashbuf(password).copy(nth);
		nth.fill(0x00, 16); // null pad to 21 bytes

		var lmr = makeResponse(lmh, nonce);
		var ntr = makeResponse(nth, nonce);
		var usernamelen = Buffer.byteLength(username, 'ucs2');
		var hostnamelen = Buffer.byteLength(hostname, 'ucs2');
		var ntdomainlen = Buffer.byteLength(ntdomain, 'ucs2');
		var lmrlen = 0x18;
		var ntrlen = 0x18;

		var ntdomainoff = 0x40;
		var usernameoff = ntdomainoff + ntdomainlen;
		var hostnameoff = usernameoff + usernamelen;
		var lmroff = hostnameoff + hostnamelen;
		var ntroff = lmroff + lmrlen;

		var msg_len = 64 + ntdomainlen + usernamelen + hostnamelen + lmrlen + ntrlen;
		var buf = new Buffer(msg_len);
		var pos = writeNtlmProtocolMarker(buf, 0x03);

		pos = write16Bits(buf, lmrlen, pos);       // short lm_resp_len;
		pos = write16Bits(buf, lmrlen, pos);       // short lm_resp_len;
		pos = write16Bits(buf, lmroff, pos);       // short lm_resp_off;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, ntrlen, pos);       // short nt_resp_len;
		pos = write16Bits(buf, ntrlen, pos);       // short nt_resp_len;
		pos = write16Bits(buf, ntroff, pos);       // short nt_resp_off;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, ntdomainlen, pos);  // short dom_len;
		pos = write16Bits(buf, ntdomainlen, pos);  // short dom_len;
		pos = write16Bits(buf, ntdomainoff, pos);  // short dom_off;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, usernamelen, pos);  // short user_len;
		pos = write16Bits(buf, usernamelen, pos);  // short user_len;
		pos = write16Bits(buf, usernameoff, pos);  // short off;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, hostnamelen, pos);  // short host_len;;
		pos = write16Bits(buf, hostnamelen, pos);  // short host_len;;
		pos = write16Bits(buf, hostnameoff, pos);  // short host_off;;
		pos = writePadding(buf, pos, 6);           // byte zero[6];
		
		pos = write16Bits(buf, msg_len, pos);      // short msg_len;;
		pos = writePadding(buf, pos, 2);           // byte zero[2];
		
		pos = write16Bits(buf, 0x8201, pos);       // short flags;
		pos = writePadding(buf, pos, 2);           // byte zero[2];

		buf.write(ntdomain, ntdomainoff, ntdomainlen, 'ucs2');
		buf.write(username, usernameoff, usernamelen, 'ucs2');
		buf.write(hostname, hostnameoff, hostnamelen, 'ucs2');
		lmr.copy(buf, lmroff, 0, lmrlen);
		ntr.copy(buf, ntroff, 0, ntrlen);

		return buf.toString('base64');
	}
};