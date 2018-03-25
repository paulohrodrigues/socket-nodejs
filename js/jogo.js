class Jogo {

    constructor(socket){
        this.map={
            tb11:-1,
            tb12:-1,
            tb13:-1,
            tb21:-1,
            tb22:-1,
            tb23:-1,
            tb31:-1,
            tb32:-1,
            tb33:-1
        }
        this.user=null;
        this.round=0;
        this.socket=socket;
    }

    play(){
        this.user=document.getElementById("user").value;
        this.callConection();
        this.logic();
        this.lookMap();
        this.lookEndGame();
        var self=this;
        setTimeout(()=>{
            if(self.round==0){
                alert("Aguardando Adversário!");
            }else{
                alert("Sua Vez!");
            }
        },500);
        document.getElementById("clear").style="visibility: hidden;";
    }




    logic(){    
        this.actionEvent();
    }

    actionEvent(){
        for(let i=1;i<=3;i++){
            for(let j=1;j<=3;j++){
                document.getElementById("tb"+i+""+j).addEventListener("click",(result)=>{
                    if(this.round==1){
                        this.check(result.toElement.id);
                    }else{
                        alert("Não é sua vez");
                    }      
                });
            }
        }
    }


    check(id){
        if(this.map[id]==-1){
            this.map[id]=this.user;
            document.getElementById(id).innerHTML=this.user;
            this.round=0;
            if(this.checkEndGame(id)==true){
                alert("Você Venceu!");
                this.socket.emit('endGame message',{user:this.user});
            }else{
                this.socket.emit('sendRound message',{option:"res",user:this.user,round:this.round});
                this.socket.emit('sendMap message',{user:this.user,idMap:id});
            }
        }else{
            alert("Esse lugar já está marcado");
        }
    }

    lookEndGame(){
        var self=this;
        this.socket.on('endGame message', function(msg){
            if(self.user!=msg.user){
                alert("Você Perdeu!");
            }
        });
    }


    checkEndGame(){
        for(let i=1;i<=3;i++){
            if( this.map["tb1"+i]==this.user && this.map["tb2"+i]==this.user && this.map["tb3"+i]==this.user ) return true;
            if( this.map["tb"+i+"1"]==this.user && this.map["tb"+i+"2"]==this.user && this.map["tb"+i+"3"]==this.user ) return true;
        }
        if( this.map["tb11"]==this.user && this.map["tb22"]==this.user && this.map["tb33"]==this.user ) return true;
        if( this.map["tb13"]==this.user && this.map["tb22"]==this.user && this.map["tb31"]==this.user ) return true;
        return false;
    }


    callConection(){
        this.callRound();
        this.sendRound();
        this.receiveRound();
    }

    lookMap(){
        var self=this;
        this.socket.on('sendMap message', function(msg){
            if(self.user!=msg.user){
                self.updateMap(msg.idMap);
            }
        });
    }

    updateMap(id){
        this.map[id]=(this.user=="O")?"X":"O";
        document.getElementById(id).innerHTML=this.map[id];
    }

    callRound(){
        this.socket.emit('callRound message',{option:"what",user:this.user});
    }

    sendRound(){
        var self=this;
        this.socket.on('callRound message', function(msg){
            if(self.user!=msg.user){
                self.socket.emit('sendRound message',{option:"res",user:self.user,round:self.round});
            }
        });
    }

    receiveRound(){
        var self=this;
        this.socket.on('sendRound message', function(msg){
            if(self.user!=msg.user){
                console.log(self.user+" recebe de "+msg.user);
                self.round=(msg.round==0)?1:0;
                if(self.round==1){
                    // alert("Sua Vez");
                }
            }
        });
    }



}