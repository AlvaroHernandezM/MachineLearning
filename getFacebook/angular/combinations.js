function combinations(array) {
    var combi = [];
    var temp= "";

    var letLen = Math.pow(2, array.length);

    for (var i = 0; i < letLen ; i++){
        temp= "";
        for (var j=0;j<array.length;j++) {
            if ((i & Math.pow(2,j))){ 
                temp += array[j] + " ";
            }
        }
        if (temp !== "") {
            combi.push(temp);
        }
    }

    return combi;
}