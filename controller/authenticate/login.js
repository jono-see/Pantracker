var login =function(user,password){

    console.log(user,password)
    if(user==="daniel" && password==="haha"){
        return true;
    }
    else{
        return false;
    }
}

module.exports=login;
