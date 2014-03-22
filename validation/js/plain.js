var addressValidation = function(address, currencyCode) {

    this.check = function(address, currencyCode) {
        var decoded = this.base58_decode(address);
        if (decoded.length != 25) return false;

        var cksum = decoded.substr(decoded.length - 4);
        var rest = decoded.substr(0, decoded.length - 4);

        var good_cksum = this.hex2a(sha256_digest(this.hex2a(sha256_digest(rest)))).substr(0, 4);

        if (cksum != good_cksum) return false;
        return true;
    };

    this.base58_decode = function(string) {
        var table = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        var table_rev = [];

        var i;
        for (i = 0; i < 58; i++) {
            table_rev[table[i]] = int2bigInt(i, 8, 0);
        }

        var l = string.length;
        var long_value = int2bigInt(0, 1, 0);

        var num_58 = int2bigInt(58, 8, 0);

        var c;
        for(i = 0; i < l; i++) {
            c = string[l - i - 1];
            long_value = this.add(long_value, mult(table_rev[c], this.pow(num_58, i)));
        }

        var hex = bigInt2str(long_value, 16);

        var str = this.hex2a(hex);

        var nPad;
        for (nPad = 0; string[nPad] == table[0]; nPad++);

        var output = str;
        if (nPad > 0) output = this.repeat("\0", nPad) + str;

        return output;
    };

    this.hex2a = function(hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    };

    this.pow = function(big, exp) {
        if (exp == 0) return int2bigInt(1, 1, 0);
        var i;
        var newbig = big;
        for (i = 1; i < exp; i++) {
            newbig = mult(newbig, big);
        }

        return newbig;
    };

    this.repeat = function(s, n){
        var a = [];
        while(a.length < n){
            a.push(s);
        }
        return a.join('');
    }

    return this.check(address, currencyCode);
};